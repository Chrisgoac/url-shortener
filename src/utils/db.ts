import { ShortUrl, User, db, eq, like } from "astro:db"

export const getUserByEmail = async (email: string) => {
  try {
    const res = await db.select().from(User).where(
      like(User.email, email)
    )
  
    if (res.length === 0) {
      return {
        success: true,
        data: null
      }
    }

    return {
      success: true,
      data: res[0]
    }
  } catch (e) {
    const error = e as Error
    return {
      success: false,
      error: error.message
    }
  }
}

export const getLinkUrl = async (code: string) => {
  try {
    const res = await db.select().from(ShortUrl).where(
      like(ShortUrl.code, code)
    )

    if (res.length === 0) {
      return {
        success: true,
        data: null
      }
    }

    return {
      success: true,
      data: res[0].url
    }
  } catch (e) {
    const error = e as Error
    return {
      success: false,
      error: error.message
    }
  } 
}

export const getUrlsFromUser = async (userId: number) => {
  try {
    const res = await db.select({
      url: ShortUrl.url,
      code: ShortUrl.code
    }).from(ShortUrl).where(
      eq(ShortUrl.user_id, userId)
    )

    return {
      success: true,
      data: res
    }
  } catch (e) {
    const error = e as Error
    return {
      success: false,
      error: error.message
    }
  }
}