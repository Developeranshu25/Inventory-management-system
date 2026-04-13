using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockController : ControllerBase
{
    private readonly StockService _service;

    public StockController(StockService service) => _service = service;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("levels")]
    public async Task<ActionResult<List<StockLevelDto>>> GetLevels(
        [FromQuery] int? productId = null, [FromQuery] int? warehouseId = null)
    {
        return Ok(await _service.GetStockLevelsAsync(productId, warehouseId));
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<PagedResult<StockTransactionDto>>> GetTransactions(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 50,
        [FromQuery] int? productId = null, [FromQuery] int? warehouseId = null,
        [FromQuery] string? transactionType = null)
    {
        return Ok(await _service.GetTransactionsAsync(page, pageSize, productId, warehouseId, transactionType));
    }

    [HttpPost("adjust")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<StockTransactionDto>> AdjustStock([FromBody] StockAdjustmentRequest request)
    {
        var transaction = await _service.AdjustStockAsync(request, GetUserId());
        return Ok(transaction);
    }

    [HttpPost("transfer")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<StockTransactionDto>> TransferStock([FromBody] StockTransferRequest request)
    {
        try
        {
            var transaction = await _service.TransferStockAsync(request, GetUserId());
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

