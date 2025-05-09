export class ColorUtils {
    static withOpacity(hex: string, opacity: number) {
      hex = hex.replace('#', '');
  
      // Convert the hex string to three separate values representing red, green, and blue
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
  
      // Return an object containing the red, green, and blue values as separate properties
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  
    static gradient(startColor: string, endColor: string, steps: number) {
      const validateHex = (color: string) => {
        return color.length === 1 ? `0${color}` : color;
      };
  
      var start: any = {
        Hex: startColor,
        R: parseInt(startColor.slice(1, 3), 16),
        G: parseInt(startColor.slice(3, 5), 16),
        B: parseInt(startColor.slice(5, 7), 16),
      };
      var end: any = {
        Hex: endColor,
        R: parseInt(endColor.slice(1, 3), 16),
        G: parseInt(endColor.slice(3, 5), 16),
        B: parseInt(endColor.slice(5, 7), 16),
      };
      let diffR = end.R - start.R;
      let diffG = end.G - start.G;
      let diffB = end.B - start.B;
  
      let stepsHex = [];
      let stepsR = [];
      let stepsG = [];
      let stepsB = [];
  
      for (var i = 0; i <= steps; i++) {
        stepsR[i] = start.R + (diffR / steps) * i;
        stepsG[i] = start.G + (diffG / steps) * i;
        stepsB[i] = start.B + (diffB / steps) * i;
        stepsHex[i] =
          '#' +
          validateHex(Math.round(stepsR[i]).toString(16)) +
          '' +
          validateHex(Math.round(stepsG[i]).toString(16)) +
          '' +
          validateHex(Math.round(stepsB[i]).toString(16));
      }
      return stepsHex;
    }
  }
  