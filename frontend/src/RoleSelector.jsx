import React, { useState } from "react";
import { Box, Typography, Button, Menu, MenuItem, ListItemIcon } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";

const roleLabels = {
  en: { general: "General", farmer: "Farmer", driver: "Driver", parent: "Parent", select: "Select Your Role" },
  es: { general: "General", farmer: "Agricultor", driver: "Conductor", parent: "Padre", select: "Selecciona tu Rol" },
  fr: { general: "Général", farmer: "Agriculteur", driver: "Conducteur", parent: "Parent", select: "Sélectionnez votre rôle" },
  de: { general: "Allgemein", farmer: "Landwirt", driver: "Fahrer", parent: "Elternteil", select: "Wähle deine Rolle" }
};

const roles = [
  { value: "general", icon: <PersonIcon fontSize="small" /> },
  { value: "farmer", icon: <AgricultureIcon fontSize="small" /> },
  { value: "driver", icon: <DirectionsCarIcon fontSize="small" /> },
  { value: "parent", icon: <FamilyRestroomIcon fontSize="small" /> }
];

export default function RoleSelector({ role, setRole, lang = "en" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const labels = roleLabels[lang] || roleLabels.en;

  return (
    <Box sx={{ my: 2 }}>
      <Typography color="#ffc069" fontWeight={700} fontSize={15} sx={{ mb: 1 }}>
        {labels.select}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={{ color: "#ffc069", borderColor: "#ffc069", fontWeight: 700, minWidth: 150 }}
        endIcon={roles.find((r) => r.value === role)?.icon}
      >
        {labels[role] || labels.general}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {roles.map(r => (
          <MenuItem
            key={r.value}
            selected={r.value === role}
            onClick={() => {
              setRole(r.value);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>{r.icon}</ListItemIcon>
            {labels[r.value]}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}