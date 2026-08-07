export interface LoginRequestDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  name: string
  accessToken: string
  role: string
  companyId: string
}

export interface SignupRequestDto {
  name: string
  email: string
  password: string
  confirmPassword: string
  companyId: string
}

export interface AccountSummaryDto {
  accountId: string
  name: string
  role: string
}

export interface AccountDto extends AccountSummaryDto {
  active: string
  createdAt: string
  companyId: string
}
