import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  BugReport,
  Architecture,
  Build,
  Description,
  Help,
  Code,
  Launch,
  Person,
  CalendarToday
} from '@mui/icons-material';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const PRHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

const HeaderContent = styled(Box)({
  flexGrow: 1,
  marginLeft: 12,
});

const PRMeta = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginTop: theme.spacing(0.5),
}));

const PRSummary = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(111, 134, 255, 0.08)' : 'rgba(111, 134, 255, 0.05)',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  marginBottom: theme.spacing(2),
}));

const LabelsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2),
  justifyContent: 'flex-end',
}));

const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

function ChangelogEntry({ 
  number, 
  title, 
  excerpt, 
  category = '', 
  author, 
  url, 
  createdAt, 
  mergedAt, 
  labels = [] 
}) {
  // Get icon based on category
  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'feature':
        return <Architecture color="primary" fontSize="large" />;
      case 'bugfix':
        return <BugReport color="error" fontSize="large" />;
      case 'improvement':
        return <Build color="success" fontSize="large" />;
      case 'documentation':
        return <Description color="info" fontSize="large" />;
      default:
        return <Help color="action" fontSize="large" />;
    }
  };

  // Get status chip for PR state
  const getStatusChip = () => {
    if (mergedAt) {
      return <Chip label="Merged" color="primary" size="small" />;
    } else {
      return <Chip label="Closed" color="error" size="small" />;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to determine if text should be dark or light based on background color
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  return (
    <StyledCard elevation={2}>
      <CardContent>
        <PRHeader>
          {getCategoryIcon()}
          <HeaderContent>
            <Typography variant="h6">
              {title || `PR #${number}`}
            </Typography>
            <PRMeta>
              {author && (
                <MetaItem>
                  <Person fontSize="small" color="action" />
                  <span>{author}</span>
                </MetaItem>
              )}
              {createdAt && (
                <MetaItem>
                  <CalendarToday fontSize="small" color="action" />
                  <span>{formatDate(createdAt)}</span>
                </MetaItem>
              )}
              {getStatusChip()}
            </PRMeta>
          </HeaderContent>
        </PRHeader>

        {category && (
          <Box display="flex" mb={2}>
            <Chip 
              label={category.charAt(0).toUpperCase() + category.slice(1)} 
              color={
                category === 'feature' ? 'primary' :
                category === 'bugfix' ? 'error' :
                category === 'improvement' ? 'success' :
                category === 'documentation' ? 'info' : 'default'
              }
              variant="outlined"
            />
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {excerpt && (
          <PRSummary>
            <Typography variant="body2">{excerpt}</Typography>
          </PRSummary>
        )}

        {labels && labels.length > 0 && (
          <LabelsContainer>
            {labels.map((label, idx) => (
              <Chip
                key={idx}
                label={label.name}
                size="small"
                sx={{
                  backgroundColor: `#${label.color}`,
                  color: isLightColor(label.color) ? '#000' : '#fff',
                }}
              />
            ))}
          </LabelsContainer>
        )}
      </CardContent>
      
      <StyledCardActions>
        <Button 
          variant="outlined" 
          startIcon={<Code />}
          size="small"
          onClick={() => window.open(`${url}/files`, '_blank')}
        >
          View Changes
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Launch />}
          size="small"
          color="primary"
          onClick={() => window.open(url, '_blank')}
        >
          View PR #{number}
        </Button>
      </StyledCardActions>
    </StyledCard>
  );
}

export default ChangelogEntry;