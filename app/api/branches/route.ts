import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: branches, error } = await supabase
      .from('branches')
      .select(`
        *,
        delivery_areas (*)
      `)
      .eq('is_active', true)
      .order('name')

    if (error) throw error

    return NextResponse.json({
      data: branches,
      error: null,
    })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch branches' },
      { status: 500 }
    )
  }
}
