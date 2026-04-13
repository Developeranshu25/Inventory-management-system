using IMS.Core.DTOs;
using IMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly ProductService _service;

    public ProductsController(ProductService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null, [FromQuery] int? categoryId = null,
        [FromQuery] bool? lowStockOnly = false)
    {
        return Ok(await _service.GetProductsAsync(page, pageSize, search, categoryId, lowStockOnly));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var product = await _service.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpGet("sku/{skuOrBarcode}")]
    public async Task<ActionResult<ProductDto>> GetBySkuOrBarcode(string skuOrBarcode)
    {
        var product = await _service.GetBySkuOrBarcodeAsync(skuOrBarcode);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductRequest request)
    {
        var product = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ProductDto>> Update(int id, [FromBody] UpdateProductRequest request)
    {
        var product = await _service.UpdateAsync(id, request);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}

