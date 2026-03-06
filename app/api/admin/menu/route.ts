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

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    if (!adminData) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: body.name,
        description: body.description || null,
        price: body.price,
        category_id: body.category_id,
        image_url: body.image_url || null,
        is_available: body.is_available ?? true,
        display_order: body.display_order || 0,
      })
      .select('*, category:categories(name)')
      .single()

    if (error) throw error

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    if (!adminData) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('menu_items')
      .update({
        name: body.name,
        description: body.description || null,
        price: body.price,
        category_id: body.category_id,
        image_url: body.image_url || null,
        is_available: body.is_available,
        display_order: body.display_order || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id)
      .select('*, category:categories(name)')
      .single()

    if (error) throw error

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { data: null, error: 'ID is required' },
        { status: 400 }
      )
    }

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    if (!adminData) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ data: { id }, error: null })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}
