
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, Check, X } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
  actionUrl?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    // Mock notifications - in real app, fetch from API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Nouvelle demande",
        message: "Une nouvelle demande de convention a été soumise",
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: "/dashboard/hr/requests"
      },
      {
        id: "2",
        title: "Évaluation due",
        message: "L'évaluation de Marie Dupont est attendue",
        type: "warning",
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        actionUrl: "/dashboard/tutor/interns"
      },
      {
        id: "3",
        title: "Demande approuvée",
        message: "Votre demande de prolongation a été approuvée",
        type: "success",
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ]

    setNotifications(mockNotifications)
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 border-yellow-300'
      case 'success': return 'bg-green-100 border-green-300'
      case 'error': return 'bg-red-100 border-red-300'
      default: return 'bg-blue-100 border-blue-300'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getTypeColor(notification.type)}`}
                          />
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
