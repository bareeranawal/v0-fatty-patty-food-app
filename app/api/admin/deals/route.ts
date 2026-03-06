import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      deal_type = 'discount',
      discount_percentage,
      fixed_price,
      image_url,
      is_active = true,
      valid_from,
      valid_until,
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Deal name is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('deals')
      .insert([
        {
          name,
          description,
          deal_type,
          discount_percentage,
          fixed_price,
          image_url,
          is_active,
          valid_from,
          valid_until,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
