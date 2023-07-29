import Swal from "sweetalert2";
import { SweetAlertIcon, SweetAlertPosition } from "sweetalert2";
export interface toastType {
	message?: string;
	position?: SweetAlertPosition;
	icon?: SweetAlertIcon;
	timer?: number;
}

const customToast = (toast: toastType): void => {
	const Toast = Swal.mixin({
		toast: true,
		position: toast.position || "top-right",
		showConfirmButton: false,
		timer: toast.timer || 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	Toast.fire({
		icon: toast.icon || "error",
		title: toast.message || "Data saved",
	});
};

export const networkDownToast = (): void => {
	customToast({
		message: "Network down",
		position: "top-right",
		icon: "error",
		timer: 3000,
	});
};

export const serverDownToast = (): void => {
	customToast({
		message: "Network error",
		position: "top-right",
		icon: "error",
		timer: 3000,
	});
};

export const keyErrorToast = (
	type: "password" | "masterkey" | "pastekey"
): void => {
	if (type === "password") {
		customToast({
			message: "Password mismatch",
			position: "top-right",
			icon: "error",
			timer: 3000,
		});
	}

	if (type === "masterkey") {
		customToast({
			message: "Masterkey mismatch",
			position: "top-right",
			icon: "error",
			timer: 3000,
		});
	}

	if (type === "pastekey") {
		customToast({
			message: "Paste is in testing mode",
			position: "top-right",
			icon: "error",
			timer: 3000,
		});
	}
};

export const toast = {
	networkDownToast,
	serverDownToast,
	keyErrorToast,
};

export default customToast;
