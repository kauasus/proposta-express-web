export interface CreateCompanyRequestDto {
  name: string
  identification: string
  phone: string
  email: string
}

export interface CompanyDto extends CreateCompanyRequestDto {
  companyId: string
}
