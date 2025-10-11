type IpObj = {
	address: string;
	nic: string;
};

const ipsState = $state<IpObj[]>([]);

export const ips = ipsState;

export function setIps(newIps: IpObj[]) {
	ipsState.splice(0, ipsState.length, ...newIps);
}
