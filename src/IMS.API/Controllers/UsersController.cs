using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserService _service;

    public UsersController(UserService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<UserDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        return Ok(await _service.GetAllAsync(page, pageSize, search));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _service.GetByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> Update(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await _service.UpdateAsync(id, request);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
