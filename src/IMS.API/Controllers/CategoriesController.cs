using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _service;

    public CategoriesController(CategoryService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetAll([FromQuery] bool includeSubcategories = true)
    {
        return Ok(await _service.GetAllAsync(includeSubcategories));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var category = await _service.GetByIdAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryRequest request)
    {
        var category = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<CategoryDto>> Update(int id, [FromBody] UpdateCategoryRequest request)
    {
        var category = await _service.UpdateAsync(id, request);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return BadRequest(new { message = "Category has products or cannot be deleted" });
        return NoContent();
    }
}

