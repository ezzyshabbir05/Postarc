"use client"

import { useState, useEffect } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading, Text } from "@astryxdesign/core/Text"
import { Card } from "@astryxdesign/core/Card"
import { Button } from "@astryxdesign/core/Button"
import { Badge } from "@astryxdesign/core/Badge"
import { TextInput } from "@astryxdesign/core/TextInput"
import { TextArea } from "@astryxdesign/core/TextArea"
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Trash2,
  Download,
  Share2,
} from "lucide-react"
import { postarcApi, type PostarcCalendarEvent } from "@/lib/postarc-api"

type CategoryFilter = "All" | "Work" | "Personal" | "Meeting" | "Important"

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const CATEGORY_COLORS: Record<string, "info" | "success" | "warning" | "neutral"> = {
  Work: "info",
  Personal: "success",
  Meeting: "warning",
  Important: "neutral",
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<PostarcCalendarEvent[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All")
  const [isNewEventOpen, setIsNewEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<PostarcCalendarEvent | null>(null)
  const [calDavCopied, setCalDavCopied] = useState(false)

  // Form states for new event
  const [eventTitle, setEventTitle] = useState("")
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [eventStartTime, setEventStartTime] = useState("09:00")
  const [eventEndTime, setEventEndTime] = useState("10:00")
  const [eventCategory, setEventCategory] = useState<
    "Work" | "Personal" | "Meeting" | "Important"
  >("Meeting")
  const [eventLocation, setEventLocation] = useState("")
  const [eventDescription, setEventDescription] = useState("")

  useEffect(() => {
    let isMounted = true
    postarcApi
      .getCalendarEvents()
      .then((evts) => {
        if (isMounted) setEvents(evts)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const goToday = () => {
    setCurrentDate(new Date())
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleString("default", { month: "long" })

  // Days calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Generate calendar grid cells (42 cells = 6 weeks)
  const calendarCells = []
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      month,
      year,
      isCurrentMonth: true,
    })
  }
  const remainingCells = 42 - calendarCells.length
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    })
  }

  // Filter events
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category === selectedCategory)

  // Events on a given date
  const getEventsForCell = (cYear: number, cMonth: number, cDay: number) => {
    const dateStr = `${cYear}-${String(cMonth + 1).padStart(2, "0")}-${String(
      cDay
    ).padStart(2, "0")}`
    return filteredEvents.filter((e) => e.start.startsWith(dateStr))
  }

  // Handle Event Creation
  const handleCreateEvent = async () => {
    if (!eventTitle.trim()) return
    const startIso = `${eventDate}T${eventStartTime}:00.000Z`
    const endIso = `${eventDate}T${eventEndTime}:00.000Z`

    const newEvt = await postarcApi.createCalendarEvent({
      title: eventTitle.trim(),
      start: startIso,
      end: endIso,
      category: eventCategory,
      location: eventLocation.trim() || undefined,
      description: eventDescription.trim() || undefined,
    })

    setEvents((prev) => [...prev, newEvt])
    setIsNewEventOpen(false)
    setEventTitle("")
    setEventLocation("")
    setEventDescription("")
  }

  // Handle Event Deletion
  const handleDeleteEvent = async (id: string) => {
    await postarcApi.deleteCalendarEvent(id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setSelectedEvent(null)
  }

  // Export to .ics
  const handleExportIcs = () => {
    const icsData = postarcApi.exportIcs(events)
    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `postarc-calendar-${year}-${month + 1}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Copy CalDAV URL
  const handleCopyCalDavUrl = () => {
    const calDav = `${window.location.origin}/dav/calendars/`
    navigator.clipboard.writeText(calDav)
    setCalDavCopied(true)
    setTimeout(() => setCalDavCopied(false), 2500)
  }

  // Group 42 cells into 6 weeks of 7 days
  const weeks = []
  for (let w = 0; w < 6; w++) {
    weeks.push(calendarCells.slice(w * 7, (w + 1) * 7))
  }

  return (
    <VStack gap={5} width="100%" height="fill" padding={4}>
      {/* ── Top Header Bar ── */}
      <HStack hAlign="between" vAlign="center" width="100%">
        <HStack gap={3} vAlign="center">
          <CalendarIcon size={24} className="text-blue-500" />
          <Heading level={2}>
            {monthName} {year}
          </Heading>
          <HStack gap={1} vAlign="center">
            <Button
              label="Prev"
              variant="secondary"
              size="sm"
              icon={<ChevronLeft size={16} />}
              onClick={prevMonth}
            />
            <Button
              label="Today"
              variant="secondary"
              size="sm"
              onClick={goToday}
            />
            <Button
              label="Next"
              variant="secondary"
              size="sm"
              icon={<ChevronRight size={16} />}
              onClick={nextMonth}
            />
          </HStack>
        </HStack>

        <HStack gap={2} vAlign="center">
          <Button
            label={calDavCopied ? "CalDAV URL Copied!" : "CalDAV Sync"}
            variant="ghost"
            size="sm"
            icon={<Share2 size={16} />}
            onClick={handleCopyCalDavUrl}
          />
          <Button
            label="Export .ics"
            variant="secondary"
            size="sm"
            icon={<Download size={16} />}
            onClick={handleExportIcs}
          />
          <Button
            label="New Event"
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsNewEventOpen(true)}
          />
        </HStack>
      </HStack>

      {/* ── Category Filter Pills ── */}
      <HStack gap={2} vAlign="center">
        {(["All", "Work", "Meeting", "Personal", "Important"] as CategoryFilter[]).map(
          (cat) => (
            <Button
              key={cat}
              label={cat}
              variant={selectedCategory === cat ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            />
          )
        )}
      </HStack>

      {/* ── 7-Day Header ── */}
      <HStack gap={2} width="100%">
        {DAYS_OF_WEEK.map((d) => (
          <HStack key={d} hAlign="center" width="14.28%" padding={2}>
            <Text type="supporting" weight="semibold" color="secondary">
              {d}
            </Text>
          </HStack>
        ))}
      </HStack>

      {/* ── Month Grid 6 Weeks ── */}
      <VStack gap={2} width="100%">
        {weeks.map((week, wIdx) => (
          <HStack key={wIdx} gap={2} width="100%">
            {week.map((cell, cIdx) => {
              const cellEvents = getEventsForCell(cell.year, cell.month, cell.day)
              const isToday =
                cell.isCurrentMonth &&
                cell.day === new Date().getDate() &&
                cell.month === new Date().getMonth() &&
                cell.year === new Date().getFullYear()

              return (
                <Card
                  key={cIdx}
                  padding={2}
                  width="14.28%"
                  minHeight={110}
                  variant={cell.isCurrentMonth ? "default" : "muted"}
                >
                  <VStack gap={1} height="100%" width="100%">
                    <HStack hAlign="between" vAlign="center" width="100%">
                      <Text
                        type="body"
                        size="sm"
                        weight={isToday ? "bold" : "medium"}
                        color={
                          isToday
                            ? "primary"
                            : cell.isCurrentMonth
                            ? "primary"
                            : "secondary"
                        }
                      >
                        {cell.day}
                      </Text>
                      {isToday && (
                        <Badge label="Today" variant="info" />
                      )}
                    </HStack>

                    {/* Event pills inside date cell */}
                    <VStack gap={1} width="100%">
                      {cellEvents.slice(0, 3).map((ev) => (
                        <Button
                          key={ev.id}
                          label={ev.title}
                          variant="ghost"
                          size="sm"
                          width="100%"
                          onClick={() => setSelectedEvent(ev)}
                        />
                      ))}
                      {cellEvents.length > 3 && (
                        <Text type="supporting" size="xsm" color="secondary">
                          +{cellEvents.length - 3} more
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </Card>
              )
            })}
          </HStack>
        ))}
      </VStack>

      {/* ── New Event Dialog ── */}
      <Dialog
        isOpen={isNewEventOpen}
        onOpenChange={setIsNewEventOpen}
        width={480}
      >
        <DialogHeader title="Create Calendar Event" />
        <VStack gap={4} width="100%" padding={4}>
          <TextInput
            label="Event Title"
            value={eventTitle}
            onChange={(val) => setEventTitle(val)}
            placeholder="e.g. Architecture Review"
            width="100%"
          />

          <HStack gap={3} width="100%">
            <TextInput
              label="Date (YYYY-MM-DD)"
              value={eventDate}
              onChange={(val) => setEventDate(val)}
              width={200}
            />
            <TextInput
              label="Start Time"
              value={eventStartTime}
              onChange={(val) => setEventStartTime(val)}
              placeholder="09:00"
              width={110}
            />
            <TextInput
              label="End Time"
              value={eventEndTime}
              onChange={(val) => setEventEndTime(val)}
              placeholder="10:00"
              width={110}
            />
          </HStack>

          <VStack gap={1} width="100%">
            <Text type="supporting" color="secondary">
              Category
            </Text>
            <HStack gap={2}>
              {(["Meeting", "Work", "Personal", "Important"] as const).map(
                (cat) => (
                  <Button
                    key={cat}
                    label={cat}
                    variant={eventCategory === cat ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setEventCategory(cat)}
                  />
                )
              )}
            </HStack>
          </VStack>

          <TextInput
            label="Location"
            value={eventLocation}
            onChange={(val) => setEventLocation(val)}
            placeholder="Room 402 or Google Meet link"
            width="100%"
          />

          <TextArea
            label="Description & Agenda"
            value={eventDescription}
            onChange={(val) => setEventDescription(val)}
            rows={3}
            width="100%"
          />

          <HStack hAlign="end" gap={2} width="100%">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setIsNewEventOpen(false)}
            />
            <Button
              label="Save Event"
              variant="primary"
              isDisabled={!eventTitle.trim()}
              onClick={handleCreateEvent}
            />
          </HStack>
        </VStack>
      </Dialog>

      {/* ── View / Delete Event Dialog ── */}
      {selectedEvent && (
        <Dialog
          isOpen={Boolean(selectedEvent)}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
          width={440}
        >
          <DialogHeader title={selectedEvent.title} />
          <VStack gap={3} width="100%" padding={4}>
            <HStack gap={2} vAlign="center">
              <Badge
                label={selectedEvent.category}
                variant={CATEGORY_COLORS[selectedEvent.category] || "info"}
              />
            </HStack>

            <HStack gap={2} vAlign="center">
              <Clock size={16} className="text-neutral-400" />
              <Text type="body" size="sm">
                {new Date(selectedEvent.start).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}{" "}
                -{" "}
                {new Date(selectedEvent.end).toLocaleTimeString([], {
                  timeStyle: "short",
                })}
              </Text>
            </HStack>

            {selectedEvent.location && (
              <HStack gap={2} vAlign="center">
                <MapPin size={16} className="text-neutral-400" />
                <Text type="body" size="sm">
                  {selectedEvent.location}
                </Text>
              </HStack>
            )}

            {selectedEvent.description && (
              <VStack gap={1} width="100%">
                <Text type="supporting" color="secondary">
                  Notes
                </Text>
                <Text type="body" size="sm">
                  {selectedEvent.description}
                </Text>
              </VStack>
            )}

            <HStack hAlign="between" width="100%">
              <Button
                label="Delete Event"
                variant="destructive"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={() => handleDeleteEvent(selectedEvent.id)}
              />
              <Button
                label="Close"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedEvent(null)}
              />
            </HStack>
          </VStack>
        </Dialog>
      )}
    </VStack>
  )
}
