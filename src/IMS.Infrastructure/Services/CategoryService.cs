using IMS.Core.DTOs;
using IMS.Core.Entities;
using IMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Services;

public class CategoryService
{
    private readonly ApplicationDbContext _db;

    public CategoryService(ApplicationDbContext db) => _db = db;

    public async Task<List<CategoryDto>> GetAllAsync(bool includeSubcategories = true)
    {
        var query = _db.Categories
            .Include(c => c.ParentCategory)
            .AsQueryable();

        if (includeSubcategories)
            query = query.Include(c => c.SubCategories);

        var categories = await query.ToListAsync();
        var productCounts = await _db.Products
            .GroupBy(p => p.CategoryId)
            .Select(g => new { CategoryId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.CategoryId, x => x.Count);

        return categories.Select(c => MapToDto(c, productCounts.GetValueOrDefault(c.Id, 0))).ToList();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var cat = await _db.Categories.Include(c => c.ParentCategory).FirstOrDefaultAsync(c => c.Id == id);
        if (cat == null) return null;
        var count = await _db.Products.CountAsync(p => p.CategoryId == id);
        return MapToDto(cat, count);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest req)
    {
        var cat = new Category
        {
            Name = req.Name,
            Description = req.Description,
            ParentCategoryId = req.ParentCategoryId
        };
        _db.Categories.Add(cat);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(cat.Id))!;
    }

    public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryRequest req)
    {
        var cat = await _db.Categories.FindAsync(id);
        if (cat == null) return null;

        if (req.Name != null) cat.Name = req.Name;
        if (req.Description != null) cat.Description = req.Description;
        if (req.ParentCategoryId.HasValue) cat.ParentCategoryId = req.ParentCategoryId;

        await _db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (await _db.Products.AnyAsync(p => p.CategoryId == id))
            return false;
        var cat = await _db.Categories.FindAsync(id);
        if (cat == null) return false;
        _db.Categories.Remove(cat);
        await _db.SaveChangesAsync();
        return true;
    }

    private static CategoryDto MapToDto(Category c, int productCount) =>
        new(c.Id, c.Name, c.Description, c.ParentCategoryId, c.ParentCategory?.Name, productCount, c.CreatedAt);
}

