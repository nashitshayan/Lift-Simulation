function FloorFactory(floor_no) {
	return {
		floor_no,
	};
}

function FloorManager(no_of_floors) {
	let building = Array(+no_of_floors)
		.fill(null)
		.map((_, i) => FloorFactory(i));

	return { building };
}

function LiftFactory(lift_no) {
	return {
		lift_no,
		current_floor: 0,
	};
}

function LiftManager(no_of_lifts) {
	let lifts = [];
	for (let i = 1; i <= no_of_lifts; i++) {
		const newLift = LiftFactory(i);
		lifts.push(newLift);
	}
	return { lifts };
}

const domElems = (() => {
	return {
		build_btn: document.getElementById('btn_make_building'),
		reset_btn: document.getElementById('btn_reset'),
		default_msg: document.getElementById('default_msg'),
		floor_ip: document.getElementById('floor_input'),
		lift_ip: document.getElementById('lift_input'),
		building_container: document.getElementById('building'),
	};
})();

const app = (() => {
	let store = {};

	const {
		build_btn,
		reset_btn,
		default_msg,
		floor_ip,
		lift_ip,
		building_container,
	} = domElems;

	const setStore = (data) => {
		store = { ...store, ...data };
	};
	const clearStore = () => {
		store = {};
	};
	const handleMakeBuilding = () => {
		const no_of_floors = floor_ip.value;
		const no_of_lifts = lift_ip.value;

		if (!no_of_floors || !no_of_lifts) {
			alert('please enter no of floors and lifts');
			return;
		}

		const { building } = FloorManager(no_of_floors);
		const { lifts } = LiftManager(no_of_lifts);

		setStore({ building, lifts });
		toggleContent();
		render();
	};
	const handleReset = () => {
		clearStore();
		clearInput();
		clearUI(building_container);

		addDefaultMsg(building_container);
		toggleContent();
	};

	function render() {
		clearUI(building_container);
		const { floors } = buildUI(store.building);
		building_container.append(...floors);
	}
	function toggleContent() {
		build_btn.classList.toggle('hide');
		reset_btn.classList.toggle('hide');
		// default_msg.classList.toggle('hide');
	}
	function clearInput() {
		floor_ip.value = '';
		lift_ip.value = '';
	}

	build_btn.addEventListener('click', handleMakeBuilding);
	reset_btn.addEventListener('click', handleReset);
})();

function buildUI(building) {
	const floors = building
		.map((floor, index) => {
			const floor_container = elem('div');
			floor_container.className = 'floor_container';

			const elevator_btn_container = elem('div');
			elevator_btn_container.className = 'elevator_btn_container';

			const elevator_btn_up = elem('button');
			elevator_btn_up.className = `btn_elevator btn_elevator--up ${
				index === building.length - 1 ? 'hide' : ''
			}`;
			elevator_btn_up.textContent = 'Up';

			const elevator_btn_down = elem('button');
			elevator_btn_down.className = `btn_elevator btn_elevator--down ${
				index === 0 ? 'hide' : ''
			}`;
			elevator_btn_down.textContent = 'Down';

			elevator_btn_container.append(elevator_btn_up, elevator_btn_down);

			const floor_name = elem('span');
			floor_name.className = 'floor_name';
			floor_name.textContent = `Floor ${floor.floor_no}`;

			floor_container.append(elevator_btn_container, floor_name);
			return floor_container;
		})
		.reverse();

	return { floors };
}
function clearUI(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}
function addDefaultMsg(container) {
	const default_msg = elem('span');
	default_msg.id = 'default_msg';
	default_msg.textContent =
		"That's a lot of empty space! Let's build something here!";
	container.append(default_msg);
}
function getFloorName(floor_no) {
	if (floor_no === 0) return 'Ground Floor';
	else return `Floor ${floor_no}`;
}
function elem(el) {
	return document.createElement(el);
}
