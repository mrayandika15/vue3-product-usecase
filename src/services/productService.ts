import apiService from "@/services/apiService";
import type { ApiResponse, ListPaginatedResponse } from "@/types/api";
import type {
  Product,
  ProductQuery,
  CategoryListResponse,
  AddOnListResponse,
} from "@/types/product";

export class ProductService {
  // Get products using POST request as specified
  static async getProducts({
    page,
    search,
    active,
    page_count,
  }: ProductQuery): Promise<ApiResponse<ListPaginatedResponse<Product>>> {
    try {
      const requestData: ProductQuery = {
        page,
        search,
        active,
        page_count,
      };

      // Using POST request to /product/item/list endpoint
      const response = await apiService.post<ListPaginatedResponse<Product>>(
        "/v2/management/product/item/list",
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

  // Get categories list (POST as per backend requirements)
  static async getCategories(): Promise<CategoryListResponse> {
    try {
      // Using axios instance to shape response to CategoryListResponse
      const axios = apiService.getAxiosInstance();
      const response = await axios.post<CategoryListResponse>(
        "/v1/management/product/item/category"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Get add-ons list (POST as per backend requirements)
  static async getAddOns(): Promise<AddOnListResponse> {
    try {
      const axios = apiService.getAxiosInstance();
      const response = await axios.post<AddOnListResponse>(
        "/v2/management/product/item/addonlist"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching add-ons:", error);
      throw error;
    }
  }

  // Create product with FormData payload (data_barang JSON string + gambar text)
  static async createProduct(formData: FormData) {
    try {
      const axios = apiService.getAxiosInstance();
      const response = await axios.post(
        "/v2/management/product/item/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
}
