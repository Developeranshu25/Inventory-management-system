using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlertsController : ControllerBase
{
    private readonly AlertService _service;

    public AlertsController(AlertService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<AlertDto>>> GetAlerts([FromQuery] bool unreadOnly = false)
    {
        return Ok(await _service.GetAlertsAsync(unreadOnly));
    }

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        await _service.MarkAsReadAsync(id);
        return Ok(new { message = "Alert marked as read" });
    }
}

