using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly ReportService _service;

    public ReportsController(ReportService service) => _service = service;

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        return Ok(await _service.GetDashboardStatsAsync());
    }

    [HttpGet("low-stock")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<List<LowStockReportDto>>> GetLowStockReport()
    {
        return Ok(await _service.GetLowStockReportAsync());
    }

    [HttpGet("expiring-items")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<List<ExpiringItemsReportDto>>> GetExpiringItems(
        [FromQuery] int daysAhead = 30)
    {
        return Ok(await _service.GetExpiringItemsReportAsync(daysAhead));
    }

    [HttpGet("sales")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<List<SalesReportDto>>> GetSalesReport(
        [FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
    {
        return Ok(await _service.GetSalesReportAsync(fromDate, toDate));
    }

    [HttpGet("top-selling")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<List<TopSellingProductDto>>> GetTopSellingProducts(
        [FromQuery] int top = 10, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
    {
        return Ok(await _service.GetTopSellingProductsAsync(top, fromDate, toDate));
    }

    [HttpGet("dead-stock")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<List<LowStockReportDto>>> GetDeadStockReport(
        [FromQuery] int daysInactive = 90)
    {
        return Ok(await _service.GetDeadStockReportAsync(daysInactive));
    }

    [HttpGet("supplier-performance")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<List<SalesReportDto>>> GetSupplierPerformance(
        [FromQuery] int? supplierId = null)
    {
        return Ok(await _service.GetSupplierPerformanceReportAsync(supplierId));
    }
}

