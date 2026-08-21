import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Toggle } from "../../components/ui/Toggle";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import {
  getAllRooms,
  updateRoom,
  getBlockedDates,
  addBlockedDate,
  removeBlockedDate,
  type AdminRoom,
  type BlockedDate,
} from "../../lib/admin";
import { adminNavItems } from "./navItems";

const roomFormSchema = z.object({
  description: z.string().min(10, "Please write at least a short sentence").max(600, "Keep it under 600 characters"),
  priceAm: z.coerce.number().min(0, "Must be 0 or more"),
  pricePm: z.coerce.number().min(0, "Must be 0 or more"),
  priceFullDay: z.coerce.number().min(0, "Must be 0 or more"),
});
type RoomFormInput = z.input<typeof roomFormSchema>;
type RoomFormOutput = z.output<typeof roomFormSchema>;

function RoomEditForm({
  room,
  onSaved,
  onClose,
}: {
  room: AdminRoom;
  onSaved: (updated: AdminRoom) => void;
  onClose: () => void;
}) {
  const showToast = useToast();
  const [isActive, setIsActive] = useState(room.isActive);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormInput, unknown, RoomFormOutput>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      description: room.description,
      priceAm: room.priceAm,
      pricePm: room.pricePm,
      priceFullDay: room.priceFullDay,
    },
  });

  async function onSubmit(values: RoomFormOutput) {
    try {
      await updateRoom(room.id, { ...values, isActive });
      onSaved({ ...room, ...values, isActive });
      showToast("Room updated", "confirm");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't save changes", "alert");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Textarea label="Description" {...register("description")} error={errors.description?.message} />
      <div className="grid grid-cols-3 gap-3">
        <Input label="AM price" type="number" step="1" min="0" {...register("priceAm")} error={errors.priceAm?.message} />
        <Input label="PM price" type="number" step="1" min="0" {...register("pricePm")} error={errors.pricePm?.message} />
        <Input
          label="Full day price"
          type="number"
          step="1"
          min="0"
          {...register("priceFullDay")}
          error={errors.priceFullDay?.message}
        />
      </div>
      <Toggle
        checked={isActive}
        onChange={() => setIsActive((v) => !v)}
        label="Room is active"
        detail="Inactive rooms are hidden from the public site and can't be booked."
      />
      <div className="flex gap-3 mt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

const blockFormSchema = z
  .object({
    roomId: z.string(),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    reason: z.string().max(200).optional(),
  })
  .refine((v) => v.endDate >= v.startDate, { message: "End date must be on or after the start date", path: ["endDate"] });
type BlockFormValues = z.infer<typeof blockFormSchema>;

export function RoomsAdmin() {
  const showToast = useToast();
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminRoom | null>(null);

  async function loadAll() {
    const [roomRows, blockedRows] = await Promise.all([getAllRooms(), getBlockedDates()]);
    setRooms(roomRows);
    setBlocked(blockedRows);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const {
    register: registerBlock,
    handleSubmit: handleSubmitBlock,
    reset: resetBlock,
    formState: { errors: blockErrors, isSubmitting: isSubmittingBlock },
  } = useForm<BlockFormValues>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: { roomId: "", startDate: "", endDate: "", reason: "" },
  });

  async function onSubmitBlock(values: BlockFormValues) {
    try {
      await addBlockedDate({
        roomId: values.roomId || null,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
      });
      showToast("Dates blocked", "confirm");
      resetBlock();
      loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't add block", "alert");
    }
  }

  async function handleRemoveBlock(id: string) {
    try {
      await removeBlockedDate(id);
      setBlocked((prev) => prev.filter((b) => b.id !== id));
      showToast("Block removed", "confirm");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't remove block", "alert");
    }
  }

  function roomName(roomId: string | null): string {
    if (!roomId) return "All rooms";
    return rooms.find((r) => r.id === roomId)?.name ?? "Unknown room";
  }

  return (
    <DashboardShell role="Admin" navItems={adminNavItems} title="Rooms">
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-[20px] bg-navy/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {rooms.map((room) => (
            <Card key={room.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-display text-lg font-bold text-navy">{room.name}</p>
                <Badge tone={room.isActive ? "confirm" : "neutral"}>{room.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="text-sm text-navy/60 leading-relaxed mb-3 line-clamp-2">{room.description}</p>
              <p className="font-mono-tight text-xs text-navy/50 mb-4">
                AM &pound;{room.priceAm} &middot; PM &pound;{room.pricePm} &middot; Full day &pound;{room.priceFullDay}
              </p>
              <Button size="sm" variant="secondary" onClick={() => setEditing(room)}>
                Edit
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <p className="font-display text-lg font-bold mb-1">Blocked dates</p>
        <p className="text-sm text-navy/55 mb-4">Block a date range for one room, or all rooms, so it can't be booked.</p>

        <form onSubmit={handleSubmitBlock(onSubmitBlock)} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Select
            label="Room"
            options={[{ value: "", label: "All rooms" }, ...rooms.map((r) => ({ value: r.id, label: r.name }))]}
            {...registerBlock("roomId")}
          />
          <Input label="Start date" type="date" {...registerBlock("startDate")} error={blockErrors.startDate?.message} />
          <Input label="End date" type="date" {...registerBlock("endDate")} error={blockErrors.endDate?.message} />
          <Input label="Reason (optional)" {...registerBlock("reason")} />
          <Button type="submit" className="sm:col-span-2 lg:col-span-4" disabled={isSubmittingBlock}>
            {isSubmittingBlock ? "Adding…" : "Add block"}
          </Button>
        </form>

        {blocked.length === 0 ? (
          <p className="text-sm text-navy/45 py-4 text-center">No blocked dates right now.</p>
        ) : (
          <div className="divide-y divide-border">
            {blocked.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-navy text-sm">{roomName(b.roomId)}</p>
                  <p className="text-xs text-navy/55">
                    {b.startDate === b.endDate ? b.startDate : `${b.startDate} – ${b.endDate}`}
                    {b.reason ? ` · ${b.reason}` : ""}
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => handleRemoveBlock(b.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.name}` : ""}>
        {editing && (
          <RoomEditForm
            room={editing}
            onClose={() => setEditing(null)}
            onSaved={(updated) => setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))}
          />
        )}
      </Modal>
    </DashboardShell>
  );
}
