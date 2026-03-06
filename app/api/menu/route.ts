import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all menu data in parallel
    const [
      categoriesResult,
      itemsResult,
      dealsResult,
      addOnsResult,
      drinkOptionsResult,
    ] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('menu_items')
        .select('*, category:categories(*)')
        .eq('is_available', true)
        .order('display_order'),
      supabase
        .from('deals')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .or('valid_until.is.null'),
      supabase
        .from('add_ons')
        .select('*')
        .eq('is_available', true),
      supabase
        .from('drink_options')
        .select('*')
        .eq('is_available', true)
        .order('size'),
    ])

    if (categoriesResult.error) throw categoriesResult.error
    if (itemsResult.error) throw itemsResult.error
    if (dealsResult.error) throw dealsResult.error
    if (addOnsResult.error) throw addOnsResult.error
    if (drinkOptionsResult.error) throw drinkOptionsResult.error

    return NextResponse.json({
      data: {
        categories: categoriesResult.data,
        items: itemsResult.data,
        deals: dealsResult.data,
        addOns: addOnsResult.data,
        drinkOptions: drinkOptionsResult.data,
      },
      error: null,
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch menu data' },
      { status: 500 }
    )
  }
}
