import {
  CameraAlt,
  ExpandLess,
  ExpandMore,
  Group,
  LocationOn,
  Sports,
  SportsHockey,
  SportsRugby,
  SportsSoccer,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { IconBadge } from '../../../shared/components/IconBadge';
import { Path } from '../model/types';

interface TreeNavProps {
  path: Path;
  onSelectNode: (next: Partial<Path>) => void;
  filter?: string;
}

interface TreeNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: TreeNode[];
  path: Partial<Path>;
  count?: number;
}

export const TreeNav = ({ path, onSelectNode, filter: _filter }: TreeNavProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'club-1': true,
    'club-2': true,
  });

  const handleToggle = (nodeId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleNodeClick = (nodePath: Partial<Path>) => {
    console.log('TreeNav.handleNodeClick:', nodePath);
    onSelectNode(nodePath);
  };

  const treeData: TreeNode[] = [
    {
      id: 'club-1',
      label: 'Palermo',
      icon: <SportsSoccer color="info" />,
      path: { clubId: 'club-1' },
      children: [
        {
          id: 'sport-1',
          label: 'Football',
          icon: <SportsSoccer color="success" />,
          path: { clubId: 'club-1', sportId: 'sport-1' },
          children: [
            {
              id: 'team-1',
              label: "Men's First Team",
              icon: <Group color="warning" />,
              path: { clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' },
              count: 3,
            },
            {
              id: 'team-2',
              label: "Ladies' Team",
              icon: <Group color="warning" />,
              path: { clubId: 'club-1', sportId: 'sport-1', teamId: 'team-2' },
              count: 2,
            },
            {
              id: 'team-3',
              label: 'U19 Academy',
              icon: <Group color="warning" />,
              path: { clubId: 'club-1', sportId: 'sport-1', teamId: 'team-3' },
              count: 2,
            },
            {
              id: 'team-4',
              label: 'U16 Youth',
              icon: <Group color="warning" />,
              path: { clubId: 'club-1', sportId: 'sport-1', teamId: 'team-4' },
              count: 0,
            },
          ],
        },
        {
          id: 'sport-2',
          label: 'Rugby',
          icon: <SportsRugby color="success" />,
          path: { clubId: 'club-1', sportId: 'sport-2' },
          children: [
            {
              id: 'team-5',
              label: 'Senior Rugby',
              icon: <Group color="warning" />,
              path: { clubId: 'club-1', sportId: 'sport-2', teamId: 'team-5' },
              count: 2,
            },
            {
              id: 'team-6',
              label: 'Junior Rugby',
              icon: <Group color="warning" />,
              path: { clubId: 'club-1', sportId: 'sport-2', teamId: 'team-6' },
              count: 1,
            },
          ],
        },
        // {
        //   id: 'sport-3',
        //   label: 'Hockey',
        //   icon: <SportsHockey color="success" />,
        //   path: { clubId: 'club-1', sportId: 'sport-3' },
        //   children: [
        //     {
        //       id: 'team-7',
        //       label: "Men's Hockey",
        //       icon: <Group color="warning" />,
        //       path: { clubId: 'club-1', sportId: 'sport-3', teamId: 'team-7' },
        //       count: 1,
        //     },
        //     {
        //       id: 'team-8',
        //       label: "Women's Hockey",
        //       icon: <Group color="warning" />,
        //       path: { clubId: 'club-1', sportId: 'sport-3', teamId: 'team-8' },
        //       count: 1,
        //     },
        //   ],
        // },
      ],
    },
    {
      id: 'club-2',
      label: 'Lommel',
      icon: <SportsSoccer color="info" />,
      path: { clubId: 'club-2' },
      children: [
        {
          id: 'sport-4',
          label: 'Football',
          icon: <SportsSoccer color="success" />,
          path: { clubId: 'club-2', sportId: 'sport-4' },
          children: [
            {
              id: 'team-9',
              label: 'First Team',
              icon: <Group color="warning" />,
              path: { clubId: 'club-2', sportId: 'sport-4', teamId: 'team-9' },
              count: 3,
            },
            {
              id: 'team-10',
              label: 'Reserve Team',
              icon: <Group color="warning" />,
              path: { clubId: 'club-2', sportId: 'sport-4', teamId: 'team-10' },
              count: 1,
            },
            {
              id: 'team-11',
              label: 'Youth Academy',
              icon: <Group color="warning" />,
              path: { clubId: 'club-2', sportId: 'sport-4', teamId: 'team-11' },
              count: 1,
            },
          ],
        },
        // {
        //   id: 'sport-5',
        //   label: 'Basketball',
        //   icon: <Sports color="success" />,
        //   path: { clubId: 'club-2', sportId: 'sport-5' },
        //   children: [
        //     {
        //       id: 'team-12',
        //       label: 'Senior Basketball',
        //       icon: <Group color="warning" />,
        //       path: { clubId: 'club-2', sportId: 'sport-5', teamId: 'team-12' },
        //       count: 1,
        //     },
        //     {
        //       id: 'team-13',
        //       label: 'Junior Basketball',
        //       icon: <Group color="warning" />,
        //       path: { clubId: 'club-2', sportId: 'sport-5', teamId: 'team-13' },
        //       count: 1,
        //     },
        //   ],
        // },
      ],
    },
    {
      id: 'pitches',
      label: 'Pitches',
      icon: <LocationOn color="info" />,
      path: { pitchesRoot: true },
      children: [
        {
          id: 'pitch-1',
          label: 'Main Stadium',
          icon: <LocationOn color="success" />,
          path: { clubId: 'club-1', pitchId: 'pitch-1' },
          children: [
            {
              id: 'camera-1',
              label: 'Main Stadium Camera 1',
              icon: <CameraAlt color="secondary" />,
              path: { pitchId: 'pitch-1', cameraId: 'camera-1' },
              count: 0,
            },
            {
              id: 'camera-2',
              label: 'Main Stadium Camera 2',
              icon: <CameraAlt color="secondary" />,
              path: { pitchId: 'pitch-1', cameraId: 'camera-2' },
              count: 0,
            },
            // {
            //   id: 'camera-3',
            //   label: 'Camera 3',
            //   icon: <CameraAlt color="secondary" />,
            //   path: { pitchId: 'pitch-1', cameraId: 'camera-3' },
            //   count: 0,
            // },
          ],
        },
        {
          id: 'pitch-2',
          label: 'Training Ground A',
          icon: <LocationOn color="success" />,
          path: { clubId: 'club-1', pitchId: 'pitch-2' },
          children: [
            {
              id: 'camera-4',
              label: 'Training A - Overview',
              icon: <CameraAlt color="secondary" />,
              path: { pitchId: 'pitch-2', cameraId: 'camera-4' },
              count: 0,
            },
            {
              id: 'camera-5',
              label: 'Camera 5',
              icon: <CameraAlt color="secondary" />,
              path: { pitchId: 'pitch-2', cameraId: 'camera-5' },
              count: 0,
            },
          ],
        },
        // {
        //   id: 'pitch-3',
        //   label: 'Training Ground B',
        //   icon: <LocationOn color="success" />,
        //   path: { clubId: 'club-1', pitchId: 'pitch-3' },
        //   children: [
        //     {
        //       id: 'camera-6',
        //       label: 'Training B - Hockey',
        //       icon: <CameraAlt color="secondary" />,
        //       path: { pitchId: 'pitch-3', cameraId: 'camera-6' },
        //       count: 0,
        //     },
        //   ],
        // },
        // {
        //   id: 'pitch-4',
        //   label: 'Stadion Soeverein',
        //   icon: <LocationOn color="success" />,
        //   path: { clubId: 'club-2', pitchId: 'pitch-4' },
        //   children: [
        //     {
        //       id: 'camera-7',
        //       label: 'Stadion Soeverein - Main',
        //       icon: <CameraAlt color="secondary" />,
        //       path: { pitchId: 'pitch-4', cameraId: 'camera-7' },
        //       count: 0,
        //     },
        //     {
        //       id: 'camera-8',
        //       label: 'Camera 8',
        //       icon: <CameraAlt color="secondary" />,
        //       path: { pitchId: 'pitch-4', cameraId: 'camera-8' },
        //       count: 0,
        //     },
        //   ],
        // },
        // {
        //   id: 'pitch-5',
        //   label: 'Training Complex',
        //   icon: <LocationOn color="success" />,
        //   path: { clubId: 'club-2', pitchId: 'pitch-5' },
        //   children: [
        //     {
        //       id: 'camera-9',
        //       label: 'Training Complex - Field 1',
        //       icon: <CameraAlt color="secondary" />,
        //       path: { pitchId: 'pitch-5', cameraId: 'camera-9' },
        //       count: 0,
        //     },
        //     {
        //       id: 'camera-10',
        //       label: 'Training Complex - Field 2',
        //       icon: <CameraAlt color="secondary" />,
        //       path: { pitchId: 'pitch-5', cameraId: 'camera-10' },
        //       count: 0,
        //     },
        //   ],
        // },
      ],
    },
  ];

  const renderTreeNode = (node: TreeNode, level = 0) => {
    const isExpanded = expanded[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = JSON.stringify(path) === JSON.stringify(node.path);

    return (
      <Box key={node.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleToggle(node.id);
              }
              handleNodeClick(node.path);
            }}
            selected={isSelected}
            sx={{
              pl: 2 + level * 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            {/* <ListItemIcon sx={{ minWidth: 40 }}>{node.icon}</ListItemIcon> */}
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{node.label}</Typography>
                  {/* {node.count !== undefined && <IconBadge count={node.count} />} */}
                </Box>
              }
            />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children?.map((child) => renderTreeNode(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        gridArea: 'tree',
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      <List component="nav" aria-label="navigation tree">
        {treeData.map((node) => renderTreeNode(node))}
      </List>
    </Box>
  );
};
