# Agent Connections Visualization with Animated Beams

This component provides a modern, visually appealing visualization of the connections between the CareerHQ agent and various external services. The visualization features a central node representing the agent, surrounded by service nodes, with animated beams flowing between them to represent data exchange.

## Features

- **Radial Layout**: Central agent node with service nodes arranged in a circular pattern
- **Animated Beams**: Flowing beams with gradient animations to visualize data transfer
- **Curved Connections**: Customizable curved paths between nodes
- **Bidirectional Flow**: Support for both inbound and outbound data flow visualization
- **Responsive Design**: Automatically adapts to container size

## Usage

```jsx
import AgentConnectionsVisualization from '@/components/agent/AgentConnectionsVisualization';

// In your component
<AgentConnectionsVisualization />
```

## Component Structure

The component is built using two main parts:

1. **AgentConnectionsVisualization.tsx**: The main component that sets up the node layout and renders the connections
2. **animated-beam.tsx**: A reusable component that creates the animated beams between nodes

## Customization

The component can be customized in several ways:

### Adding or Removing Services

Modify the service nodes in the `AgentConnectionsVisualization.tsx` file:

```jsx
{/* Add a new service node */}
<div className="absolute top-10 left-2/3 transform -translate-x-1/2">
  <Circle ref={newServiceRef}>
    <Icons.newService />
  </Circle>
</div>

{/* Add corresponding beam */}
<AnimatedBeam
  containerRef={containerRef}
  fromRef={newServiceRef}
  toRef={centerRef}
  curvature={-50}
  gradientStartColor="#your-color"
  gradientStopColor="#your-color"
/>
```

### Customizing Beam Appearance

Each beam can be customized with the following props:

- `curvature`: Adjusts how curved the path is (positive or negative values)
- `pathColor`: The color of the base path
- `pathOpacity`: Opacity of the base path (0-1)
- `gradientStartColor`: Start color of the animated gradient
- `gradientStopColor`: End color of the animated gradient
- `duration`: Duration of the animation in seconds
- `delay`: Delay before the animation starts in seconds
- `reverse`: When true, the animation flows from the service to the agent (inbound)

## How It Works

1. The main component sets up refs for the container and each node
2. The `AnimatedBeam` component calculates the path between nodes
3. SVG paths are created with both a static path and an animated gradient
4. The gradient animates along the path to create the flowing effect
5. The component uses ResizeObserver to recalculate paths when the container size changes

## Dependencies

- React with Hooks
- Framer Motion for animations
- Tailwind CSS for styling

## Accessibility

- The visualization is purely decorative and doesn't require interaction
- Service icons include proper sizing for visibility
- The component uses semantic HTML where appropriate

## Demo

A demo of this component is available at `/demo/agent-viz` which showcases the visualization with explanations of the implementation details.
