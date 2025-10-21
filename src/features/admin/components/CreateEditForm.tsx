import { Delete, Save } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import {
    CameraSchema,
    ClubSchema,
    PitchSchema,
    SportSchema,
    TeamSchema,
    UserSchema,
} from '../model/schemas';
import { AnyEntity, EntityKind } from '../model/types';

interface CreateEditFormProps {
    kind: EntityKind;
    value: AnyEntity | Partial<AnyEntity>;
    onChange: (patch: Partial<AnyEntity>) => void;
    onSubmit: () => void;
    onSave: (patch: Partial<AnyEntity>) => void;
    onDelete?: (id: string) => void;
    entityId?: string;
}

export const CreateEditForm = ({
    kind,
    value,
    onChange,
    onSubmit,
    onSave,
    onDelete,
    entityId,
}: CreateEditFormProps) => {
    const [formData, setFormData] = useState<Partial<AnyEntity>>(value);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(value);
    }, [value]);

    const getSchema = () => {
        switch (kind) {
            case 'user':
                return UserSchema;
            case 'team':
                return TeamSchema;
            case 'pitch':
                return PitchSchema;
            case 'camera':
                return CameraSchema;
            case 'club':
                return ClubSchema;
            case 'sport':
                return SportSchema;
            default:
                return z.object({});
        }
    };

    const handleFieldChange = (field: string, newValue: unknown) => {
        const updated = { ...formData, [field]: newValue } as Partial<AnyEntity>;
        setFormData(updated);
        onChange(updated);

        // Clear error for this field
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setErrors({});

        try {
            const schema = getSchema();
            const validatedData = schema.parse(formData);
            await onSave(validatedData);
            onSubmit();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        if (entityId && onDelete) {
            onDelete(entityId);
        }
    };

    const renderUserForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={((formData as Record<string, unknown>).email as string) || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={((formData as Record<string, unknown>).role as string) || 'member'}
                        onChange={(e) => handleFieldChange('role', e.target.value)}
                        label="Role"
                    >
                        <MenuItem value="member">Member</MenuItem>
                        <MenuItem value="tenant_admin">Tenant Admin</MenuItem>
                    </Select>
                    {errors.role && (
                        <Typography variant="caption" color="error">
                            {errors.role}
                        </Typography>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Status</FormLabel>
                    <RadioGroup
                        value={((formData as Record<string, unknown>).status as string) || 'active'}
                        onChange={(e) => handleFieldChange('status', e.target.value)}
                    >
                        <FormControlLabel value="active" control={<Radio />} label="Active" />
                        <FormControlLabel value="invited" control={<Radio />} label="Invited" />
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
    );

    const renderTeamForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Team Name"
                    value={formData.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.sportId}>
                    <InputLabel>Sport</InputLabel>
                    <Select
                        value={((formData as Record<string, unknown>).sportId as string) || ''}
                        onChange={(e) => handleFieldChange('sportId', e.target.value)}
                        label="Sport"
                    >
                        <MenuItem value="sport-1">Football</MenuItem>
                        <MenuItem value="sport-2">Rugby</MenuItem>
                        <MenuItem value="sport-3">Hockey</MenuItem>
                        <MenuItem value="sport-4">Basketball</MenuItem>
                    </Select>
                    {errors.sportId && (
                        <Typography variant="caption" color="error">
                            {errors.sportId}
                        </Typography>
                    )}
                </FormControl>
            </Grid>
        </Grid>
    );

    const renderPitchForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Pitch Name"
                    value={formData.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.clubId}>
                    <InputLabel>Club</InputLabel>
                    <Select
                        value={((formData as Record<string, unknown>).clubId as string) || ''}
                        onChange={(e) => handleFieldChange('clubId', e.target.value)}
                        label="Club"
                    >
                        <MenuItem value="club-1">Palermo</MenuItem>
                        <MenuItem value="club-2">Lommel</MenuItem>
                    </Select>
                    {errors.clubId && (
                        <Typography variant="caption" color="error">
                            {errors.clubId}
                        </Typography>
                    )}
                </FormControl>
            </Grid>
        </Grid>
    );

    const renderCameraForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Camera Name (Optional)"
                    value={formData.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.pitchId}>
                    <InputLabel>Pitch</InputLabel>
                    <Select
                        value={((formData as Record<string, unknown>).pitchId as string) || ''}
                        onChange={(e) => handleFieldChange('pitchId', e.target.value)}
                        label="Pitch"
                    >
                        <MenuItem value="pitch-1">Main Stadium</MenuItem>
                        <MenuItem value="pitch-2">Training Ground A</MenuItem>
                        <MenuItem value="pitch-3">Training Ground B</MenuItem>
                        <MenuItem value="pitch-4">Stadion Soeverein</MenuItem>
                        <MenuItem value="pitch-5">Training Complex</MenuItem>
                    </Select>
                    {errors.pitchId && (
                        <Typography variant="caption" color="error">
                            {errors.pitchId}
                        </Typography>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.sportContext}>
                    <InputLabel>Sport Context</InputLabel>
                    <Select
                        value={((formData as Record<string, unknown>).sportContext as string) || 'football'}
                        onChange={(e) => handleFieldChange('sportContext', e.target.value)}
                        label="Sport Context"
                    >
                        <MenuItem value="football">Football</MenuItem>
                        <MenuItem value="rugby">Rugby</MenuItem>
                        <MenuItem value="hockey">Hockey</MenuItem>
                    </Select>
                    {errors.sportContext && (
                        <Typography variant="caption" color="error">
                            {errors.sportContext}
                        </Typography>
                    )}
                </FormControl>
            </Grid>
        </Grid>
    );

    const renderForm = () => {
        switch (kind) {
            case 'user':
                return renderUserForm();
            case 'team':
                return renderTeamForm();
            case 'pitch':
                return renderPitchForm();
            case 'camera':
                return renderCameraForm();
            default:
                return <Typography color="text.secondary">Form for {kind} not implemented yet.</Typography>;
        }
    };

    return (
        <Box>
            {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Please fix the errors below before saving.
                </Alert>
            )}

            {renderForm()}

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                {entityId && onDelete && (
                    <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>
                        Delete
                    </Button>
                )}
                <Button
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </Box>
        </Box>
    );
};
