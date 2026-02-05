const bg =
document.getElementById("bg-canvas");

const colors = [
    "#5b27f8",
    "#00c6ff",
    "#9d4edd"
];

const orbs = []
const ORB_COUNT = 3;

for (let i= 0; i < ORB_COUNT; i++) {
        const orb =
    document.createElement("div");
    orb.className = "bg-orb"
    orb.style.background = colors[i % colors.length];

    bg.appendChild(orb);
    orbs.push({
        el: orb,
        x: Math.random() *
        window.innerWidth,
        y: Math.random() *
        window.innerHeight,
        tx: Math.random() *
        window.innerWidth,
        ty: Math.random() *
        window.innerHeight,
        speed: 0.003 + Math.random() * 0.002 });
    }

    function animate(){
        orbs.forEach(o => {
        o.x += (o.tx - o.x) * o.speed;
        o.y += (o.ty - o.y) * o.speed;
        
        o.el.style.transform =
    `translate(${o.x}px, ${o.y}px)`;
    if (Math.abs(o.x - o.tx) < 1 && Math.abs(o.y - o.ty) < 1){
        o.tx = Math.random() *
        window.innerWidth;
        o.ty = Math.random() *
        window.innerHeight;
     }
    });

    requestAnimationFrame(animate);
    }

    animate();