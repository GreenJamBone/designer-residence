import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone } = await req.json()

  if (!email || !firstName || !lastName) {
    return NextResponse.json(
      { message: 'First name, last name, and email are required.' },
      { status: 400 }
    )
  }

  const token = process.env.HUBSPOT_ACCESS_TOKEN

  if (!token) {
    return NextResponse.json({ message: 'CRM is not configured.' }, { status: 503 })
  }

  const body: Record<string, unknown> = {
    properties: {
      firstname: firstName,
      lastname: lastName,
      email,
      ...(phone ? { phone } : {}),
    },
  }

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  // Duplicate contact — treat as success
  if (response.status === 409) {
    return NextResponse.json({ message: 'success' })
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: data.message || 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'success' })
}
