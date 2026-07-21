"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { User } from "@/types"
import { mockUsers } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("chinkara-user")
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("chinkara-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("chinkara-user")
    }
  }, [user])

  const signIn = useCallback(async () => {
    setIsLoading(true)
    // Simulate Google Sign-In delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // In production, this would integrate with Firebase Auth
    // For demo, we'll use the first mock user
    setUser(mockUsers[0])
    setIsLoading(false)
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem("chinkara-user")
  }, [])

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
