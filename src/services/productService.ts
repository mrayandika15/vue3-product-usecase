import apiService from "@/services/apiService";
import type {
  ApiResponse,
  ListPaginatedResponse,
  ProductListRequest,
} from "@/types/api";
import type { Product } from "@/types/product";

export class ProductService {
  // Get products using POST request as specified
  static async getProducts(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<ApiResponse<ListPaginatedResponse<Product>>> {
    try {
      const requestData: ProductListRequest = {
        page,
        per_page: perPage,
        search,
        sort_by: sortBy,
        sort_order: sortOrder,
        tampilkan: perPage,
      };

      // Using POST request to /product/item/list endpoint
      const response = await apiService.post<ListPaginatedResponse<Product>>(
        "/product/item/list",
        requestData
      );

      const transformedData: ApiResponse<ListPaginatedResponse<Product>> = {
        ...response,
        data: {
          ...response.data,
          data: this.transformToTreeData(response.data.data),
        },
      };

      return transformedData;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Transform products to tree structure for variants
  private static transformToTreeData(products: Product[]): Product[] {
    // Add safety check for products array
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    return products.map((product) => {
      // If product has variants, add them as children
      if (
        product.has_variant &&
        product.variant &&
        Array.isArray(product.variant) &&
        product.variant.length > 0
      ) {
        return {
          ...product,
          children: product.variant.map((variant: unknown) => {
            const variantProduct = variant as Product;
            return {
              ...variantProduct,
              isVariant: true,
              category: variantProduct.category || product.category,
              updated_at: variantProduct.updated_at || product.updated_at,
            };
          }),
        };
      }
      return product;
    });
  }

  // Additional method for searching products
  static async searchProducts(
    searchTerm: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<ApiResponse<ListPaginatedResponse<Product>>> {
    return this.getProducts(page, perPage, searchTerm);
  }

  // Method for getting products with specific sorting
  static async getProductsSorted(
    sortBy: string,
    sortOrder: "asc" | "desc" = "asc",
    page: number = 1,
    perPage: number = 10
  ): Promise<ApiResponse<ListPaginatedResponse<Product>>> {
    return this.getProducts(page, perPage, undefined, sortBy, sortOrder);
  }
}
