using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IMS.API.Controllers;

public record ReceiveRequest(int WarehouseId);

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PurchaseOrdersController : ControllerBase
{
    private readonly PurchaseService _service;

    public PurchaseOrdersController(PurchaseService service) => _service = service;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<PagedResult<PurchaseOrderDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null, [FromQuery] int? supplierId = null)
    {
        return Ok(await _service.GetAllAsync(page, pageSize, status, supplierId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PurchaseOrderDetailDto>> GetById(int id)
    {
        var po = await _service.GetByIdAsync(id);
        if (po == null) return NotFound();
        return Ok(po);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<PurchaseOrderDetailDto>> Create([FromBody] CreatePurchaseOrderRequest request)
    {
        var po = await _service.CreateAsync(request, GetUserId());
        return CreatedAtAction(nameof(GetById), new { id = po.Id }, po);
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Approve(int id)
    {
        var result = await _service.ApproveAsync(id, GetUserId());
        if (!result) return BadRequest(new { message = "Purchase order cannot be approved" });
        return Ok(new { message = "Purchase order approved" });
    }

    [HttpPost("{id}/receive")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<IActionResult> Receive(int id, [FromBody] ReceiveRequest request)
    {
        var result = await _service.ReceiveAsync(id, request.WarehouseId, GetUserId());
        if (!result) return BadRequest(new { message = "Purchase order cannot be received" });
        return Ok(new { message = "Goods received and stock updated" });
    }
}

