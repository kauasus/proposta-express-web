export interface CreateCustomerRequestDto {
  name: string
  email: string
  phone: string
  companyId: string
  otherPhone?: string
  identification?: string
  zipCode?: string
  address?: string
  streetNumber?: string
  sublocality?: string
  city?: string
  state?: string
  country?: string
}
