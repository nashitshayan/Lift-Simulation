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

const storeManager = (() => {
	let store = {};

	function clearStore() {
		store = {};
	}
	function setStore(data) {
		store = { ...store, ...data };
	}

	function getStore() {
		return store;
	}
	return {
		setStore,
		getStore,
		clearStore,
	};
})();

const app = (() => {
	storeManager.clearStore();

	const {
		build_btn,
		reset_btn,
		default_msg,
		floor_ip,
		lift_ip,
		building_container,
	} = domElems;

	const handleMakeBuilding = () => {
		const no_of_floors = +floor_ip.value;
		const no_of_lifts = +lift_ip.value;

		if (!no_of_floors || !no_of_lifts) {
			alert('please enter no of floors and lifts');
			return;
		}
		if (no_of_lifts > 6) {
			alert(
				"Sorry! Currently, we only have space for maximum 6 lifts. We're working to expand it!",
			);
			return;
		}
		storeManager.setStore({
			building: createBuilding(no_of_floors, no_of_lifts),
		});
		toggleContent();
		render();
	};
	const handleReset = () => {
		storeManager.clearStore();
		clearInput();
		clearUI(building_container);

		addDefaultMsg(building_container);
		toggleContent();
	};
	const handleLiftUp = (calling_floor) => {
		const store = storeManager.getStore();
		const {
			building: { lifts },
		} = store;

		const isSameFloor = lifts.some(
			(lift) => lift.current_floor === calling_floor,
		);

		if (isSameFloor) {
			alert('The lift is already on current floor.');
			return;
		}

		const nearestLift = findNearestLift(lifts, calling_floor);
		const updatedLift = { ...nearestLift, current_floor: calling_floor };

		storeManager.setStore({
			building: {
				...store.building,
				lifts: store.building.lifts.map((oldLift, index) => {
					if (oldLift.lift_no === updatedLift.lift_no) return updatedLift;
					return oldLift;
				}),
			},
		});

		moveLift(nearestLift.current_floor, updatedLift);
	};

	const handleLiftDown = (calling_floor) => {
		handleLiftUp(calling_floor);
	};

	build_btn.addEventListener('click', handleMakeBuilding);
	reset_btn.addEventListener('click', handleReset);

	function render() {
		const { building } = storeManager.getStore();
		clearUI(building_container);
		buildUI(building_container, building);
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
	function buildUI(container, building) {
		const { no_of_floors, no_of_lifts, lifts } = building;

		const floors = Array(no_of_floors)
			.fill(null)
			.map((_, index) => {
				const floor_container = elem('div');
				floor_container.className = 'floor_container';

				const lift_btn_container = elem('div');
				lift_btn_container.className = 'lift_btn_container';

				const lift_btn_up = elem('button');
				lift_btn_up.className = `btn_lift btn_lift--up ${
					index === no_of_floors - 1 ? 'hide' : ''
				}`;
				lift_btn_up.textContent = 'Up';

				const lift_btn_down = elem('button');
				lift_btn_down.className = `btn_lift btn_lift--down ${
					index === 0 ? 'hide' : ''
				}`;
				lift_btn_down.textContent = 'Down';

				lift_btn_up.addEventListener('click', () => handleLiftUp(index + 1));
				lift_btn_down.addEventListener('click', () =>
					handleLiftDown(index + 1),
				);

				lift_btn_container.append(lift_btn_up, lift_btn_down);

				const floor_name = elem('span');
				floor_name.className = 'floor_name';
				floor_name.textContent = `Floor ${index + 1}`;

				floor_container.append(lift_btn_container, floor_name);

				if (index === 0) {
					const lifts_markup = lifts.map((_, indx) => {
						const lift_div = elem('div');
						lift_div.className = `lift ${indx === 0 ? 'first' : ''}`;
						lift_div.dataset.lift_no = _.lift_no;
						return lift_div;
					});
					floor_container.append(...lifts_markup);
				}
				return floor_container;
			})
			.reverse();

		container.append(...floors);
		// return { floors };
	}
	function moveLift(old_floor, { lift_no, current_floor }) {
		const lift_div = document.querySelector(`[data-lift_no='${lift_no}']`);
		const current_pos = findCurrentPos(lift_div.style.transform);

		const new_pos = 200 * (old_floor - current_floor);

		lift_div.style.transform = `translateY(${current_pos + new_pos}px)`;
	}
})();

function createBuilding(no_of_floors, no_of_lifts) {
	const lifts = Array(no_of_lifts)
		.fill(null)
		.map((_, ind) => ({
			lift_no: ind + 1,
			current_floor: 1,
		}));

	return {
		no_of_floors,
		no_of_lifts,
		lifts,
	};
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
function findNearestLift(lifts, calling_floor) {
	const floor_differences = lifts.map((_) =>
		Math.abs(_.current_floor - calling_floor),
	);
	const nearestFloorIndex = floor_differences.indexOf(
		Math.min(...floor_differences),
	);
	return lifts[nearestFloorIndex];
}
function findCurrentPos(str) {
	const regex = /\-?[0-9]*/g;
	return parseInt(str.match(regex).filter(Boolean)[0] || 0);
}
function elem(el) {
	return document.createElement(el);
}

// function getFloorName(floor_no) {
// 	if (floor_no === 0) return 'Ground Floor';
// 	else return `Floor ${floor_no}`;
// }
