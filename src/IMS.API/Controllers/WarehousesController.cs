using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WarehousesController : ControllerBase
{
    private readonly WarehouseService _service;

    public WarehousesController(WarehouseService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<WarehouseDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WarehouseDto>> GetById(int id)
    {
        var warehouse = await _service.GetByIdAsync(id);
        if (warehouse == null) return NotFound();
        return Ok(warehouse);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<WarehouseDto>> Create([FromBody] CreateWarehouseRequest request)
    {
        var warehouse = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = warehouse.Id }, warehouse);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<WarehouseDto>> Update(int id, [FromBody] UpdateWarehouseRequest request)
    {
        var warehouse = await _service.UpdateAsync(id, request);
        if (warehouse == null) return NotFound();
        return Ok(warehouse);
    }
}

