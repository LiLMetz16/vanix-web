import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, email } = body;

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    // Check if email or username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: currentUser.userId } },
          {
            OR: [
              { email },
              { username }
            ]
          }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already taken' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.userId },
      data: { username, email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
