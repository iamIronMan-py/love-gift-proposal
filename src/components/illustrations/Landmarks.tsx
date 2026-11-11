import { TransparentImage } from './TransparentImage';

export function DubaiLandmarks() {
  return (
    <div className="landmarks landmarks--dubai" aria-hidden="true">
      <TransparentImage className="landmarks__img landmarks__img--burj" src="/burj-khalifa.jpg" />
      <TransparentImage className="landmarks__img landmarks__img--arab" src="/burj-al-arab.png" />
    </div>
  );
}

export function ParisLandmarks() {
  return (
    <div className="landmarks landmarks--paris" aria-hidden="true">
      <TransparentImage className="landmarks__img landmarks__img--eiffel" src="/eiffel-tower.avif" />
      <TransparentImage className="landmarks__img landmarks__img--notre" src="/notre-dame.webp" />
    </div>
  );
}
