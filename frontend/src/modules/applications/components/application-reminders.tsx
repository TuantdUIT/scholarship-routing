"use client";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { AlertTriangle, Bell, Clock, Edit, Plus, X } from "lucide-react";
import { useState } from "react";
import type {
	ApplicationDetail,
	ApplicationReminder,
	ApplicationReminderType,
} from "@/modules/applications/data/application-types";

// Helper function to safely format the date
const formatDate = (dateString: string) => {
	try {
		// Handles "YYYY-MM-DD" format by splitting and creating a UTC date
		const parts = dateString.split("-");
		if (parts.length === 3) {
			const year = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
			const day = parseInt(parts[2], 10);
			const date = new Date(Date.UTC(year, month, day));
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
				timeZone: "UTC",
			});
		}
		return dateString; // Fallback to original string if format is unexpected
	} catch (error) {
		console.error("Invalid date format:", dateString, error);
		return dateString; // Return original string on error
	}
};

interface ApplicationRemindersProps {
	application: ApplicationDetail;
}

export function ApplicationReminders({
	application,
}: ApplicationRemindersProps) {
	const [reminders, setReminders] = useState<ApplicationReminder[]>(
		application.reminders,
	);
	const [newReminder, setNewReminder] = useState<{
		date: string;
		message: string;
		type: ApplicationReminderType;
	}>({
		date: "",
		message: "",
		type: "deadline",
	});

	const addReminder = () => {
		if (newReminder.date && newReminder.message) {
			const reminder: ApplicationReminder = {
				id: `r${Date.now()}`,
				...newReminder,
				isActive: true,
			};
			setReminders([...reminders, reminder]);
			setNewReminder({ date: "", message: "", type: "deadline" });
		}
	};

	const removeReminder = (id?: string) => {
		if (!id) return;
		setReminders(reminders.filter((r) => r.id !== id));
	};

	const toggleReminder = (id?: string) => {
		if (!id) return;
		setReminders(
			reminders.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)),
		);
	};

	const getReminderIcon = (type: string) => {
		switch (type) {
			case "deadline":
				return <AlertTriangle className="h-4 w-4 text-orange-600" />;
			case "task":
				return <Clock className="h-4 w-4 text-blue-600" />;
			default:
				return <Bell className="h-4 w-4 text-muted-foreground" />;
		}
	};

	const getReminderBadge = (type: string) => {
		switch (type) {
			case "deadline":
				return (
					<Badge className="bg-orange-100 text-orange-800 border-0">
						Deadline
					</Badge>
				);
			case "task":
				return (
					<Badge className="bg-blue-100 text-blue-800 border-0">Task</Badge>
				);
			default:
				return <Badge variant="outline">{type}</Badge>;
		}
	};

	return (
		<div className="space-y-6">
			{/* Add New Reminder */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Bell className="h-5 w-5" />
							Application Reminders
						</CardTitle>
						<Dialog>
							<DialogTrigger asChild>
								<Button size="sm">
									<Plus className="h-4 w-4 mr-1" />
									Add Reminder
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add New Reminder</DialogTitle>
									<DialogDescription>
										Set up a reminder to help you stay on track with your
										application.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<label className="text-sm font-medium">Reminder Date</label>
										<Input
											type="date"
											value={newReminder.date}
											onChange={(e) =>
												setNewReminder({ ...newReminder, date: e.target.value })
											}
										/>
									</div>
									<div>
										<label className="text-sm font-medium">Message</label>
										<Textarea
											placeholder="Enter reminder message..."
											value={newReminder.message}
											onChange={(e) =>
												setNewReminder({
													...newReminder,
													message: e.target.value,
												})
											}
										/>
									</div>
									<div className="flex gap-2">
										<Button onClick={addReminder} className="flex-1">
											Add Reminder
										</Button>
										<Button
											variant="outline"
											onClick={() =>
												setNewReminder({
													date: "",
													message: "",
													type: "deadline",
												})
											}
										>
											Cancel
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Stay organized with custom reminders for deadlines, tasks, and
						important dates.
					</p>
				</CardContent>
			</Card>

			{/* Active Reminders */}
			<div className="space-y-4">
				{reminders.length === 0 ? (
					<Card>
						<CardContent className="text-center py-8">
							<Bell className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
							<h3 className="font-medium mb-2">No Reminders Set</h3>
							<p className="text-sm text-muted-foreground">
								Add reminders to stay on top of your application deadlines and
								tasks.
							</p>
						</CardContent>
					</Card>
				) : (
					reminders.map((reminder) => (
						<Card
							key={reminder.id}
							className={`${reminder.isActive ? "" : "opacity-60"}`}
						>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										{getReminderIcon(reminder.type ?? "")}
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												{getReminderBadge(reminder.type ?? "")}
												<span className="text-sm text-muted-foreground">
													{formatDate(reminder.date)}
												</span>
											</div>
											<p className="text-sm">{reminder.message}</p>
										</div>
									</div>

									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleReminder(reminder.id)}
											className="h-8 w-8 p-0"
										>
											<Edit className="h-3 w-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeReminder(reminder.id)}
											className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
