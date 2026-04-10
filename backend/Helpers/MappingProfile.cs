using AutoMapper;
using backend.Models;
using backend.DTOs;

namespace backend.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User Mappings
        CreateMap<User, UserDto>();
        CreateMap<UserRegisterDto, User>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));

        // Category Mappings
        CreateMap<Category, CategoryDto>().ReverseMap();

        // Product Mappings
        CreateMap<Product, ProductReadDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
            .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => src.ProductImages.Select(i => i.ImageUrl)));
        CreateMap<ProductUpsertDto, Product>()
            .ForMember(dest => dest.ProductImages, opt => opt.Ignore());

        // Order Mappings
        CreateMap<Order, OrderReadDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.User != null ? src.User.FullName : null));
        CreateMap<OrderDetail, OrderDetailReadDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : null));
        CreateMap<OrderCreateDto, Order>();

        // Cart Mappings
        CreateMap<Cart, CartReadDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems));
        CreateMap<CartItem, CartItemReadDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : null))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Product != null && src.Product.ProductImages.Any() 
                ? src.Product.ProductImages.FirstOrDefault(i => i.IsPrimary)!.ImageUrl ?? src.Product.ProductImages.First().ImageUrl 
                : null))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product != null ? src.Product.Price : 0));
        CreateMap<CartItemUpdateDto, CartItem>();
    }
}
