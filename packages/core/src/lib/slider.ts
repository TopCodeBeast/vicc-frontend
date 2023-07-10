// We are using a power law in order to have a better precision for low values. But we are still multiplying the resulting values in order to have a higher number of discret values on the slider.
export const powerAlgorithm = ({ power }: { power: number }) => ({
  scale: (x: number) => {
    if (!x) return 0;

    return x ** power / 1000 ** power;
  },
  unscale: (x: number) => {
    if (!x) return 0;

    return (x * 1000 ** power) ** (1 / power);
  },
});
