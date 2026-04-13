using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalesReturnsController : ControllerBase
{
    private readonly SalesReturnService _service;

    public SalesReturnsController(SalesReturnService service) => _service = service;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    [Authorize(Roles = "Admin,Manager,SalesStaff")]
    public async Task<ActionResult<SalesReturnDto>> CreateReturn([FromBody] SalesReturnRequest request)
    {
        try
        {
            var result = await _service.CreateReturnAsync(request, GetUserId());
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
