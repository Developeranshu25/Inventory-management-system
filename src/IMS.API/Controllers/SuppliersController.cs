using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SuppliersController : ControllerBase
{
    private readonly SupplierService _service;

    public SuppliersController(SupplierService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<SupplierDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        return Ok(await _service.GetAllAsync(page, pageSize, search));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SupplierDto>> GetById(int id)
    {
        var supplier = await _service.GetByIdAsync(id);
        if (supplier == null) return NotFound();
        return Ok(supplier);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<SupplierDto>> Create([FromBody] CreateSupplierRequest request)
    {
        var supplier = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = supplier.Id }, supplier);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<SupplierDto>> Update(int id, [FromBody] UpdateSupplierRequest request)
    {
        var supplier = await _service.UpdateAsync(id, request);
        if (supplier == null) return NotFound();
        return Ok(supplier);
    }
}

