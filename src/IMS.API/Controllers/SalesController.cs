using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalesController : ControllerBase
{
    private readonly SalesService _service;

    public SalesController(SalesService service) => _service = service;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<PagedResult<SaleDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null,
        [FromQuery] int? warehouseId = null)
    {
        return Ok(await _service.GetAllAsync(page, pageSize, fromDate, toDate, warehouseId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SaleDetailDto>> GetById(int id)
    {
        var sale = await _service.GetByIdAsync(id);
        if (sale == null) return NotFound();
        return Ok(sale);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager,SalesStaff")]
    public async Task<ActionResult<SaleDetailDto>> Create([FromBody] CreateSaleRequest request)
    {
        var sale = await _service.CreateAsync(request, GetUserId());
        return CreatedAtAction(nameof(GetById), new { id = sale.Id }, sale);
    }
}

