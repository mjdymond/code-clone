# Agent Connections Visualization

This component creates an interactive visualization showing how the CareerHQ central agent connects to various external services. It's designed to match the reference image with a radial layout, connecting lines, and animated beams between nodes.

## Features

- **Radial Layout**: Central agent node with service nodes arranged in a circular pattern
- **Interactive Nodes**: Clickable service nodes that trigger animations
- **Animated Beams**: Visual data flow animations between the central node and service nodes
- **Auto-cycling Demo Mode**: Automatically cycles through connections for demonstration purposes
- **Responsive Design**: Scales appropriately for different screen sizes

## Installation

To use this component in your project, you need to:

1. Copy the following files to your project:
   - `src/components/agent/AgentConnectionsVisualization.tsx`
   - `src/components/agent/AnimatedBeam.tsx`

2. Add the required keyframe animations to your CSS (typically in `globals.css`):

```css
@keyframes beam-animation {
  0% {
    opacity: 0.1;
    transform: translateX(-100%) translateY(10%) rotate(-5deg);
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.1;
    transform: translateX(100%) translateY(-10%) rotate(5deg);
  }
}

@keyframes pulse-animation {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
```

3. Make sure you have the necessary dependencies installed:

```bash
npm install framer-motion
```

4. Ensure your project uses Tailwind CSS (the component is built with Tailwind classes)

## Usage

```jsx
import AgentConnectionsVisualization from '@/components/agent/AgentConnectionsVisualization';

// Basic usage
<AgentConnectionsVisualization />

// With custom class
<AgentConnectionsVisualization className="my-8" />
```

## Component Structure

The component consists of:

1. **AnimatedBeam.tsx**: A reusable component for the data flow animation effect
2. **AgentConnectionsVisualization.tsx**: The main visualization component

## Customization

You can customize the visualization by modifying the following in the `AgentConnectionsVisualization.tsx` file:

- **`services` array**: Add or remove connected services
- **`centerSize` and `nodeSize`**: Adjust the size of the nodes
- **`radius`**: Change the distance between the central node and service nodes

## Animation Details

The component includes several types of animations:

1. **Pulse Animation**: Subtle scaling of the central node
2. **Beam Animation**: Data flow visualization between nodes 
3. **Node Highlight**: Scale effect when a node is active
4. **Auto-cycling**: Periodic activation of random nodes for demonstration

## Demo

A demonstration page is available at `/demo/connections` which showcases the component in action.

## Dependencies

- React
- Framer Motion
- Tailwind CSS

## Accessibility

- Interactive elements have appropriate hover states
- Service names are displayed when nodes are activated

## Performance Considerations

- Animations are optimized for performance
- SVG elements are used for better scaling
- Animation cycles are managed with clean useEffect hooks

## Integrating with the CareerHQ Project

To integrate this visualization into the main CareerHQ project:

1. You can place it on the home page to show integrations
2. Use it in the agents page to visualize available connections
3. Include it in marketing materials to demonstrate the system's connectivity capabilities

## Customizing for Different Use Cases

### CareerHQ-Specific Services

You can modify the `services` array to match the actual integrations of the CareerHQ system:

```typescript
const services: ServiceNode[] = [
  { 
    name: 'LinkedIn', 
    color: 'rgba(10, 102, 194, 0.2)',
    icon: <LinkedInIcon />
  },
  { 
    name: 'Indeed', 
    color: 'rgba(0, 120, 174, 0.2)',
    icon: <IndeedIcon />
  },
  // Add more CareerHQ-specific integrations
];
```

### Different Visual Styles

You can customize the appearance by:

1. Adjusting the colors in each service node
2. Changing the animation timing
3. Modifying the sizes and spacing of the nodes
4. Adding additional animation effects

## Future Enhancements

Potential improvements that could be added:

1. Animated data particles traveling along connection lines
2. Status indicators showing connection health
3. Tooltips with detailed integration information
4. Real-time connection status from a backend API
5. Click-through capabilities to navigate to service detail pages
