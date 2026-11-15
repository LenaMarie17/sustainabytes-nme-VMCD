import { NextResponse, type NextRequest } from 'next/server'
import { getRouteDistances, RouteError } from '@/lib/routing'

export async function GET(request: NextRequest) {
  const fromId = request.nextUrl.searchParams.get('from') ?? ''
  const toId = request.nextUrl.searchParams.get('to') ?? ''

  try {
    return NextResponse.json(await getRouteDistances(fromId, toId))
  } catch (error) {
    if (error instanceof RouteError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Could not calculate the route.' }, { status: 500 })
  }
}
