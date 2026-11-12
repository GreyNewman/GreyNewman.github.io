const scene = document.querySelector(".scene");
const cube = document.querySelector(".cube");
const faces = document.querySelectorAll(".face");

const faceRotations = {
    front:  { x: 0,   y: 0 },
    back:   { x: 0,   y: 180 },
    right:  { x: 0,   y: -90 },
    left:   { x: 0,   y: 90 },
    top:    { x: -90, y: 0 },
    bottom: { x: 90,  y: 0 }
};

const oppositeFaces = {
    front: "back",
    back: "front",
    right: "left",
    left: "right",
    top: "bottom",
    bottom: "top"
};

let rotationY = -30;
let rotationX = -5;

let hovering = false;
let targetX = -5;
let targetY = -30
let previousTime = 0;

const rotationSpeed = 45;
const smoothness = 4;

faces.forEach(face => {
    face.addEventListener("mouseenter", () => {
        const direction = Object.keys(faceRotations)
            .find(name => face.classList.contains(name));

        if (!direction) return;
        
        faces.forEach(f => f.classList.remove("hide-label"));

        const opposite = oppositeFaces[direction];

        document.querySelector(`.${opposite}`).classList.add("hide-label");

        hovering = true;

        targetX = faceRotations[direction].x;
        targetY = faceRotations[direction].y;
    });
});

scene.addEventListener("mouseleave", () => {
    faces.forEach(face => face.classList.remove("hide-label"));
    hovering = false;
});

function updateTextOpacity() {
    const rotations = {
        front: [0, 0, 1],
        back: [0, 0, -1],
        right: [1, 0, 0],
        left: [-1, 0, 0],
        top: [0, -1, 0],
        bottom: [0, 1, 0]
    };

    faces.forEach(face => {
        const name = Object.keys(rotations)
            .find(key => face.classList.contains(key));

        const [x, y, z] = rotations[name];

        const radX = rotationX * Math.PI / 180;
        const radY = rotationY * Math.PI / 180;

        const rotatedZ =
            (y * Math.sin(radX) + z * Math.cos(radX)) *
            Math.cos(radY) +
            x * Math.sin(radY);

        face.style.setProperty(
            "--text-opacity",
            rotatedZ > 0.1 ? "1" : "0.1"
        );
    });
}

function animate(time) {

    const delta = previousTime
        ? Math.min((time - previousTime) / 1000, 0.05)
        : 0;

    previousTime = time;

    if (hovering) {

        
        rotationY += (targetY - rotationY) * Math.min(1, smoothness * delta);
        rotationX += (targetX - rotationX) * Math.min(1, smoothness * delta);

    } else {

        rotationY += rotationSpeed * delta;

        if (rotationY > 180) {
            rotationY -= 360;
        }

    }

    
    cube.style.transform =
        `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    updateTextOpacity();

    requestAnimationFrame(animate);
}


requestAnimationFrame(animate);