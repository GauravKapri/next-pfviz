# PathFinder — Algorithm Visualizer

An interactive web application for visualizing pathfinding and maze generation algorithms. Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**.

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

### Pathfinding Algorithms
- **BFS (Breadth-First Search)** — Explores neighbors level by level. Guarantees shortest path on unweighted graphs.
- **DFS (Depth-First Search)** — Dives deep along one branch before backtracking. Fast but not optimal.
- **Dijkstra's Algorithm** — Optimal for weighted graphs. Accounts for weight nodes.
- **A* Search** — Uses Manhattan heuristic to guide search. Fastest optimal algorithm here.

### Maze Generators
- **Recursive Division** — Divides space with walls and punches holes. Creates long corridors.
- **Randomized Prim's** — Grows a spanning tree from a seed. Creates organic, winding paths.
- **Binary Tree** — Each cell carves east or south. Creates a strong diagonal bias.

### Interactive Features
- Draw walls and weighted nodes on the grid
- Drag and drop start/end nodes
- Adjustable animation speed (Slow, Medium, Fast)
- Real-time statistics (nodes visited, path length, execution time)
- Dark/Light theme toggle
- Mobile-friendly touch support

## Tech Stack

| Category       | Technology          |
|----------------|---------------------|
| Framework      | Next.js 16 (App Router) |
| Language       | TypeScript 5        |
| UI Library     | React 19            |
| Styling        | Tailwind CSS 4      |
| State Management | Zustand 5         |
| Icons          | Lucide React        |
| Utilities      | clsx, tailwind-merge |

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── grid/             # Grid board and cell components
│   ├── header/           # Top navigation bar
│   ├── sidebar/          # Control panel, stats panel, mobile bar
│   └── AppShell.tsx      # Main application layout
├── lib/                  # Core logic
│   ├── algorithms/       # Pathfinding & maze algorithms
│   │   ├── graph/        # BFS, DFS, Dijkstra, A*
│   │   └── maze/         # Maze generators
│   ├── utils/            # Utility functions
│   ├── constants.ts      # App constants
│   └── store.ts          # Zustand state management
└── types/                # TypeScript type definitions
    ├── algorithm.ts      # Algorithm types & metadata
    └── cell.ts           # Grid cell types
```

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- Package manager: npm, yarn, pnpm, or Bun

### Installation

```bash
# Clone the repository
git clone https://github.com/GauravKapri/next-pfviz
cd next-pfviz

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Linting

```bash
npm run lint
```

## Usage

1. **Select an Algorithm** — Choose from BFS, DFS, Dijkstra, or A* in the left panel.
2. **Draw Obstacles** — Use the Draw tools to add walls or weighted nodes.
3. **Position Nodes** — Drag the start (diamond) and end (circle) nodes to reposition.
4. **Run** — Click "Visualize" to watch the algorithm find the shortest path.
5. **Generate Maze** — Pick a maze algorithm and click "Generate" to create a random maze.
6. **View Stats** — See nodes visited, path length, and execution time in the right panel.

## Keyboard & Mouse Controls

| Action              | Input                |
|---------------------|----------------------|
| Draw walls/weights  | Click / Drag         |
| Reposition nodes    | Drag Start / End     |
| Mobile support      | Touch & drag         |
| Run algorithm       | Click "Visualize"    |
| Clear all           | Click "Reset"        |

## Configuration

Key constants in `src/lib/constants.ts`:

| Constant        | Value | Description                    |
|-----------------|-------|--------------------------------|
| `CELL_SIZE`     | 28    | Grid cell size in pixels       |
| `WEIGHT_VALUE`  | 5     | Cost multiplier for weight nodes |
| `GRAPH_BATCH`   | 8     | Steps per animation frame      |
| `MAZE_BATCH`    | 4     | Maze animation batch size      |
| `START_OFFSET`  | 2     | Start node offset from edge    |
| `END_OFFSET`    | 3     | End node offset from edge      |

## License

This project is private and not licensed for public distribution.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Icons by [Lucide](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- State management by [Zustand](https://zustand-demo.pmnd.rs)
