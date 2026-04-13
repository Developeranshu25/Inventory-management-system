using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (result == null)
            return Unauthorized(new { message = "Invalid email or password" });
        return Ok(result);
    }

    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        if (result == null)
            return BadRequest(new { message = "Email already exists" });
        return Ok(result);
    }
}

