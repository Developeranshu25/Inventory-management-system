using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class ProductService
{
    private readonly ApplicationDbContext _db;

    public ProductService(ApplicationDbContext db) => _db = db;

    public async Task<PagedResult<ProductDto>> GetProductsAsync(int page = 1, int pageSize = 20,
        string? search = null, int? categoryId = null, bool? lowStockOnly = false)
    {
        var query = _db.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p =>
                p.Name.Contains(search) || (p.Sku != null && p.Sku.Contains(search)) ||
                (p.Barcode != null && p.Barcode.Contains(search)));

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);

        if (lowStockOnly == true)
        {
            var stockQuery = _db.StockLevels
                .GroupBy(s => s.ProductId)
                .Select(g => new { ProductId = g.Key, Total = g.Sum(x => x.Quantity) });
            query = query.Where(p =>
                stockQuery.Where(s => s.ProductId == p.Id).Select(s => s.Total).FirstOrDefault() < p.MinimumStockLevel);
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var productIds = items.Select(p => p.Id).ToList();
        var stockLevels = await _db.StockLevels
            .Where(s => productIds.Contains(s.ProductId))
            .GroupBy(s => s.ProductId)
            .Select(g => new { ProductId = g.Key, Total = g.Sum(x => x.Quantity) })
            .ToDictionaryAsync(x => x.ProductId, x => x.Total);

        var dtos = items.Select(p => MapToDto(p, stockLevels.GetValueOrDefault(p.Id, 0))).ToList();
        return new PagedResult<ProductDto>(dtos, total, page, pageSize);
    }

    public async Task<int> GetTotalStockAsync(int productId) =>
        await _db.StockLevels.Where(s => s.ProductId == productId).SumAsync(s => s.Quantity);

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return null;

        var totalStock = await _db.StockLevels.Where(s => s.ProductId == id).SumAsync(s => s.Quantity);
        return MapToDto(product, totalStock);
    }

    public async Task<ProductDto?> GetBySkuOrBarcodeAsync(string skuOrBarcode)
    {
        var product = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .FirstOrDefaultAsync(p => p.Sku == skuOrBarcode || p.Barcode == skuOrBarcode);
        if (product == null) return null;

        var totalStock = await _db.StockLevels.Where(s => s.ProductId == product.Id).SumAsync(s => s.Quantity);
        return MapToDto(product, totalStock);
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest req)
    {
        var product = new Product
        {
            Name = req.Name,
            Sku = req.Sku,
            Barcode = req.Barcode,
            CategoryId = req.CategoryId,
            SupplierId = req.SupplierId,
            Unit = req.Unit,
            CostPrice = req.CostPrice,
            SellingPrice = req.SellingPrice,
            MinimumStockLevel = req.MinimumStockLevel,
            Description = req.Description,
            ImageUrl = req.ImageUrl,
            VariantInfo = req.VariantInfo
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(product.Id))!;
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductRequest req)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return null;

        if (req.Name != null) product.Name = req.Name;
        if (req.Sku != null) product.Sku = req.Sku;
        if (req.Barcode != null) product.Barcode = req.Barcode;
        if (req.CategoryId.HasValue) product.CategoryId = req.CategoryId.Value;
        if (req.SupplierId.HasValue) product.SupplierId = req.SupplierId;
        if (req.Unit != null) product.Unit = req.Unit;
        if (req.CostPrice.HasValue) product.CostPrice = req.CostPrice.Value;
        if (req.SellingPrice.HasValue) product.SellingPrice = req.SellingPrice.Value;
        if (req.MinimumStockLevel.HasValue) product.MinimumStockLevel = req.MinimumStockLevel.Value;
        if (req.Description != null) product.Description = req.Description;
        if (req.ImageUrl != null) product.ImageUrl = req.ImageUrl;
        if (req.VariantInfo != null) product.VariantInfo = req.VariantInfo;
        if (req.IsActive.HasValue) product.IsActive = req.IsActive.Value;

        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return false;
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    private static ProductDto MapToDto(Product p, int totalStock) =>
        new(p.Id, p.Name, p.Sku, p.Barcode, p.CategoryId, p.Category.Name, p.SupplierId, p.Supplier?.Name,
            p.Unit, p.CostPrice, p.SellingPrice, p.MinimumStockLevel, p.Description, p.ImageUrl, p.VariantInfo,
            p.IsActive, totalStock, p.CreatedAt);
}

