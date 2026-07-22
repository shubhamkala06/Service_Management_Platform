import { House, ClipboardList, Laptop, User } from 'lucide-svelte';

export default [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: House
	},
	{
		label: 'Tickets',
		href: '/tickets',
		icon: ClipboardList
	},
	{
		label: 'Assets',
		href: '/assets',
		icon: Laptop
	},
	{
		label: 'Profile',
		href: '/profile',
		icon: User
	}
];
