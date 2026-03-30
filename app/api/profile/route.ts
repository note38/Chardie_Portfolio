import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROFILE = {
  id: "1",
  email: "test@example.com",
  github: "felixmacaspac",
  linkedin: "felixmacaspac",
  bio: "Always interested in new opportunities and collaborations.",
  name: "Gotis",
  surname: "Chardie",
  tagline:
    "Computer Science Senior & Frontend Developer | Building user-centric web applications, and digital solutions that bridge the gap between Design, and Technical logic.",
  currentRole: "Frontend Developer",
  roleFocus: "Focused on Next.js & React",
};

export async function GET() {
  try {
    let profile = await prisma.profile.findUnique({
      where: { id: "1" },
    });
    if (!profile) {
      profile = await prisma.profile.create({
        data: DEFAULT_PROFILE,
      });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const profile = await prisma.profile.upsert({
      where: { id: "1" },
      update: {
        email: data.email,
        github: data.github,
        linkedin: data.linkedin,
        bio: data.bio,
        name: data.name,
        surname: data.surname,
        tagline: data.tagline,
        currentRole: data.currentRole,
        roleFocus: data.roleFocus,
      },
      create: {
        id: "1",
        email: data.email ?? DEFAULT_PROFILE.email,
        github: data.github ?? DEFAULT_PROFILE.github,
        linkedin: data.linkedin ?? DEFAULT_PROFILE.linkedin,
        bio: data.bio ?? DEFAULT_PROFILE.bio,
        name: data.name ?? DEFAULT_PROFILE.name,
        surname: data.surname ?? DEFAULT_PROFILE.surname,
        tagline: data.tagline ?? DEFAULT_PROFILE.tagline,
        currentRole: data.currentRole ?? DEFAULT_PROFILE.currentRole,
        roleFocus: data.roleFocus ?? DEFAULT_PROFILE.roleFocus,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
