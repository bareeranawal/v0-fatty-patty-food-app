import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { type, is_available } = await request.json()

    const supabase = await createClient()

    if (type === 'item') {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ is_available, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data, error: null })
    } else if (type === 'deal') {
      const { data, error } = await supabase
        .from('deals')
        .update({ is_active: is_available })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data, error: null })
    }

    return NextResponse.json(
      { data: null, error: 'Invalid type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error toggling availability:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to update' },
      { status: 500 }
    )
  }
}
