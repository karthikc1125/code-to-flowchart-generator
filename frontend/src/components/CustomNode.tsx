import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const nodeTypes = {
  start: {
    shape: 'rounded',
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  end: {
    shape: 'rounded',
    color: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  process: {
    shape: 'rectangle',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  decision: {
    shape: 'diamond',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  loop: {
    shape: 'hexagon',
    color: '#9C27B0',
    backgroundColor: '#F3E5F5',
  },
};

const CustomNode: React.FC<NodeProps> = ({ data, type = 'process' }) => {
  const nodeStyle = nodeTypes[type as keyof typeof nodeTypes] || nodeTypes.process;
  
  const getShapeStyle = () => {
    switch (nodeStyle.shape) {
      case 'rounded':
        return 'rounded-full';
      case 'diamond':
        return 'rotate-45';
      case 'hexagon':
        return 'clip-path-polygon';
      default:
        return 'rounded';
    }
  };

  return (
    <div
      className={`${getShapeStyle()} p-4 min-w-[150px] border-2`}
      style={{
        borderColor: nodeStyle.color,
        backgroundColor: nodeStyle.backgroundColor,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: nodeStyle.color }}
      />
      <div className="text-center font-medium" style={{ color: nodeStyle.color }}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: nodeStyle.color }}
      />
    </div>
  );
};

export default memo(CustomNode); 