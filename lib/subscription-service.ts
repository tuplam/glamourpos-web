interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceMonthly: number
  priceYearly: number
  maxLocations: number
  maxEmployees: number
  maxCustomers: number
  features: string[]
  limitations: string[]
  isActive: boolean
}

interface Business {
  id: string
  name: string
  businessType: string
  numberOfLocations: number
  numberOfEmployees: number
  ownerFirstName: string
  ownerLastName: string
  ownerEmail: string
  ownerPhone?: string
  billingAddress?: string
  billingCity?: string
  billingState?: string
  billingZipCode?: string
  billingCountry: string
  createdAt: string
  updatedAt: string
}

interface Subscription {
  id: string
  businessId: string
  planId: string
  status: "active" | "cancelled" | "suspended" | "past_due"
  billingCycle: "monthly" | "yearly"
  currentPeriodStart: string
  currentPeriodEnd: string
  trialStart?: string
  trialEnd?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}

interface PaymentMethod {
  id: string
  businessId: string
  stripePaymentMethodId?: string
  cardLastFour?: string
  cardBrand?: string
  cardExpMonth?: number
  cardExpYear?: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface Invoice {
  id: string
  businessId: string
  subscriptionId: string
  stripeInvoiceId?: string
  amountDue: number
  amountPaid: number
  currency: string
  status: "draft" | "open" | "paid" | "void" | "uncollectible"
  periodStart: string
  periodEnd: string
  dueDate?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

interface SubscriptionUsage {
  id: string
  businessId: string
  subscriptionId: string
  usageType: "locations" | "employees" | "customers" | "appointments"
  currentCount: number
  limitCount: number
  periodStart: string
  periodEnd: string
  createdAt: string
  updatedAt: string
}

export class SubscriptionService {
  private static baseUrl = "/api/subscription"

  // Subscription Plans
  static async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await fetch(`${this.baseUrl}/plans`)
    if (!response.ok) throw new Error("Failed to fetch plans")
    return response.json()
  }

  static async getPlan(id: string): Promise<SubscriptionPlan> {
    const response = await fetch(`${this.baseUrl}/plans/${id}`)
    if (!response.ok) throw new Error("Failed to fetch plan")
    return response.json()
  }

  // Business Management
  static async createBusiness(businessData: Omit<Business, "id" | "createdAt" | "updatedAt">): Promise<Business> {
    const response = await fetch(`${this.baseUrl}/businesses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(businessData),
    })
    if (!response.ok) throw new Error("Failed to create business")
    return response.json()
  }

  static async getBusiness(id: string): Promise<Business> {
    const response = await fetch(`${this.baseUrl}/businesses/${id}`)
    if (!response.ok) throw new Error("Failed to fetch business")
    return response.json()
  }

  static async updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
    const response = await fetch(`${this.baseUrl}/businesses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update business")
    return response.json()
  }

  // Subscription Management
  static async createSubscription(subscriptionData: {
    businessId: string
    planId: string
    billingCycle: "monthly" | "yearly"
    paymentMethodId?: string
  }): Promise<Subscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscriptionData),
    })
    if (!response.ok) throw new Error("Failed to create subscription")
    return response.json()
  }

  static async getSubscription(businessId: string): Promise<Subscription | null> {
    const response = await fetch(`${this.baseUrl}/subscriptions?businessId=${businessId}`)
    if (!response.ok) throw new Error("Failed to fetch subscription")
    const data = await response.json()
    return data.subscription || null
  }

  static async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update subscription")
    return response.json()
  }

  static async cancelSubscription(id: string, cancelAtPeriodEnd = true): Promise<Subscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cancelAtPeriodEnd }),
    })
    if (!response.ok) throw new Error("Failed to cancel subscription")
    return response.json()
  }

  // Payment Methods
  static async addPaymentMethod(
    businessId: string,
    paymentMethodData: {
      stripePaymentMethodId: string
      cardLastFour: string
      cardBrand: string
      cardExpMonth: number
      cardExpYear: number
      isDefault?: boolean
    },
  ): Promise<PaymentMethod> {
    const response = await fetch(`${this.baseUrl}/payment-methods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, ...paymentMethodData }),
    })
    if (!response.ok) throw new Error("Failed to add payment method")
    return response.json()
  }

  static async getPaymentMethods(businessId: string): Promise<PaymentMethod[]> {
    const response = await fetch(`${this.baseUrl}/payment-methods?businessId=${businessId}`)
    if (!response.ok) throw new Error("Failed to fetch payment methods")
    return response.json()
  }

  static async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    const response = await fetch(`${this.baseUrl}/payment-methods/${id}/set-default`, {
      method: "POST",
    })
    if (!response.ok) throw new Error("Failed to set default payment method")
    return response.json()
  }

  static async removePaymentMethod(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/payment-methods/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to remove payment method")
  }

  // Invoices
  static async getInvoices(businessId: string): Promise<Invoice[]> {
    const response = await fetch(`${this.baseUrl}/invoices?businessId=${businessId}`)
    if (!response.ok) throw new Error("Failed to fetch invoices")
    return response.json()
  }

  static async getInvoice(id: string): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/invoices/${id}`)
    if (!response.ok) throw new Error("Failed to fetch invoice")
    return response.json()
  }

  static async downloadInvoice(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/invoices/${id}/download`)
    if (!response.ok) throw new Error("Failed to download invoice")
    return response.blob()
  }

  // Usage Tracking
  static async getUsage(businessId: string): Promise<SubscriptionUsage[]> {
    const response = await fetch(`${this.baseUrl}/usage?businessId=${businessId}`)
    if (!response.ok) throw new Error("Failed to fetch usage")
    return response.json()
  }

  static async updateUsage(businessId: string, usageType: string, count: number): Promise<SubscriptionUsage> {
    const response = await fetch(`${this.baseUrl}/usage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, usageType, count }),
    })
    if (!response.ok) throw new Error("Failed to update usage")
    return response.json()
  }

  // Utility Methods
  static async checkLimits(businessId: string): Promise<{
    locations: { current: number; limit: number; exceeded: boolean }
    employees: { current: number; limit: number; exceeded: boolean }
    customers: { current: number; limit: number; exceeded: boolean }
  }> {
    const response = await fetch(`${this.baseUrl}/limits?businessId=${businessId}`)
    if (!response.ok) throw new Error("Failed to check limits")
    return response.json()
  }

  static async previewPlanChange(
    businessId: string,
    newPlanId: string,
  ): Promise<{
    prorationAmount: number
    nextInvoiceAmount: number
    effectiveDate: string
  }> {
    const response = await fetch(`${this.baseUrl}/preview-change`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, newPlanId }),
    })
    if (!response.ok) throw new Error("Failed to preview plan change")
    return response.json()
  }

  static async changePlan(businessId: string, newPlanId: string): Promise<Subscription> {
    const response = await fetch(`${this.baseUrl}/change-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, newPlanId }),
    })
    if (!response.ok) throw new Error("Failed to change plan")
    return response.json()
  }
}
