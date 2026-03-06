import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const [categoriesResult, itemsResult, dealsResult] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('menu_items').select('*, category:categories(name)').order('display_order'),
      supabase.from('deals').select('*').order('name'),
    ])

    if (categoriesResult.error) throw categoriesResult.error
    if (itemsResult.error) throw itemsResult.error
    if (dealsResult.error) throw dealsResult.error

    return NextResponse.json({
      data: {
        categories: categoriesResult.data,
        items: itemsResult.data,
        deals: dealsResult.data,
      },
      error: null,
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
